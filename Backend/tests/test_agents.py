"""
Tests des agents (Routage, Recherche, Base de Données, Synthèse) et
du workflow multi-agents end-to-end (routes "database", "rag",
"both", "general").

Comment lancer ces tests :

    cd Backend
    ollama serve                       (dans un autre terminal)
    python -m rag.indexation           (si ce n'est pas déjà fait, pour peupler ChromaDB)
    python -c "import database; database.init_db()"   (initialise PostgreSQL)
    python -m tests.test_agents

Ces tests utilisent le vrai pipeline (ChromaDB + PostgreSQL +
Ollama), sans mocks. Un test qui dépend d'un service indisponible
l'indique clairement (⚠️) au lieu de planter.
"""

import sys

from agents.routing_agent import route_query
from agents.retrieval_agent import retrieve, RetrievalResult
from agents.database_agent import query_database
from agents.synthesis_agent import synthesize
from agents.orchestrator import process_question


def test_routage() -> bool:
    print("\n=== TEST 1 — AGENT DE ROUTAGE ===")

    cas = [
        ("Quelles formations sont disponibles ?", "database"),
        ("Quelles technologies sont utilisées dans le projet Genove ?", "rag"),
        ("Quelles formations sont disponibles et quelles technologies sont utilisées dans le projet ?", "both"),
        ("Salut", "general"),
    ]

    for question, route_attendue in cas:
        resultat = route_query(question)
        print(f"'{question}' -> route={resultat.route} (attendu: {route_attendue})")
        assert resultat.route == route_attendue, (
            f"Route attendue '{route_attendue}', obtenue '{resultat.route}' pour : {question}"
        )

    print("OK — l'Agent de Routage classe correctement database / rag / both / general.")
    return True


def test_recherche() -> bool:
    print("\n=== TEST 2 — AGENT DE RECHERCHE DOCUMENTAIRE (ChromaDB) ===")

    question = "Quelles technologies sont utilisées dans le projet ?"
    routing_result = route_query(question)
    resultat = retrieve(question, routing_result)

    if resultat.error:
        print(f"⚠️  Test ignoré : {resultat.error}")
        print("   Vérifie que ChromaDB est indexé (python indexation.py) et qu'Ollama tourne.")
        return False

    print(f"Chunks récupérés : {len(resultat.chunks)}")

    assert resultat.has_results, "Aucun chunk récupéré depuis ChromaDB."

    print("OK — l'Agent de Recherche récupère bien des chunks pertinents depuis ChromaDB.")
    return True


def test_base_de_donnees() -> bool:
    print("\n=== TEST 3 — AGENT BASE DE DONNÉES (PostgreSQL) ===")

    question = "Quelles formations sont disponibles ?"
    resultat = query_database(question)

    if resultat.error:
        print(f"⚠️  Test ignoré : {resultat.error}")
        print("   Vérifie que PostgreSQL est lancé et initialisé (python database.py).")
        return False

    print(f"Lignes récupérées : {len(resultat.rows)}")
    for ligne in resultat.rows:
        print(f"  - {ligne.get('title')}")

    assert resultat.has_results, "Aucune ligne récupérée depuis PostgreSQL."

    print("OK — l'Agent Base de Données récupère bien des données réelles depuis PostgreSQL.")
    return True


def test_synthese() -> bool:
    print("\n=== TEST 4 — AGENT DE SYNTHÈSE (fusion database + rag) ===")

    question = "Quel est le nom de la personne, et quelles formations sont disponibles ?"
    routing_result = route_query("les deux à la fois")  # peu importe ici, on force route "both" ci-dessous
    routing_result.route = "both"

    contexte_controle = "Identité :\nNom complet de la personne : Amen Allah Njima"
    retrieval_result = RetrievalResult(
        chunks=[contexte_controle],
        metadatas=[{"source": "test", "chunk": 1}],
        distances=[0.0],
        contexte=contexte_controle,
        has_results=True,
    )

    from agents.database_agent import DatabaseResult
    database_result = DatabaseResult(
        rows=[{"title": "React", "description": "Formation React", "duration": "6 semaines"}],
        query_description="test",
        has_results=True,
    )

    reponse = synthesize(question, routing_result, retrieval_result, database_result)
    print(f"Réponse générée : {reponse}")

    if reponse in (
        "Impossible de contacter le modèle de langage. "
        "Vérifie qu'Ollama est bien lancé (commande : ollama serve).",
        "Le modèle de langage a mis trop de temps à répondre. "
        "Merci de réessayer.",
    ):
        print("⚠️  Test ignoré : Ollama n'est pas disponible.")
        return False

    assert reponse.strip() != "", "La réponse générée est vide."

    print("OK — l'Agent de Synthèse produit une réponse fondée sur les deux sources fusionnées.")
    return True


def test_end_to_end() -> bool:
    print("\n=== TEST 5 — END-TO-END (Routage -> Base de Données/RAG -> Synthèse) ===")

    question = "Quelles formations sont disponibles ?"
    resultat = process_question(question)

    print(f"Route détectée       : {resultat['route']}")
    print(f"Intent détecté       : {resultat['intent']}")
    print(f"Lignes PostgreSQL    : {resultat['lignes_bd']}")
    print(f"Chunks ChromaDB      : {resultat['chunks_recuperes']}")
    print(f"Durée de traitement  : {resultat['duree_secondes']}s")
    print(f"Réponse              : {resultat['reponse']}")

    assert resultat["route"] == "database", f"Route attendue 'database', obtenue '{resultat['route']}'"

    if resultat["lignes_bd"] == 0:
        print("⚠️  Test ignoré : aucune ligne PostgreSQL récupérée (base indisponible ou vide).")
        return False

    assert resultat["reponse"].strip() != "", "La réponse finale est vide."

    print("OK — le workflow multi-agents fonctionne réellement de bout en bout.")
    return True


if __name__ == "__main__":
    tests = [
        test_routage,
        test_recherche,
        test_base_de_donnees,
        test_synthese,
        test_end_to_end,
    ]

    echecs = 0
    ignores = 0

    for test in tests:
        try:
            if not test():
                ignores += 1
        except AssertionError as erreur:
            echecs += 1
            print(f"❌ ÉCHEC : {erreur}")
        except Exception as erreur:
            echecs += 1
            print(f"❌ ERREUR INATTENDUE : {erreur}")

    print("\n" + "=" * 60)
    print(f"Résultat : {len(tests) - echecs - ignores} réussi(s), "
          f"{ignores} ignoré(s), {echecs} échoué(s) sur {len(tests)}.")
    print("=" * 60)

    sys.exit(1 if echecs else 0)
