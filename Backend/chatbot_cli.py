from rag import search_and_answer


def main():
    print("=" * 60)
    print("🤖 Chatbot RAG - CLI")
    print("=" * 60)
    print("Posez vos questions sur vos documents.")
    print("Tapez 'exit' ou 'quit' pour quitter.")
    print()

    while True:
        question = input("Vous : ").strip()

        if question.lower() in ["exit", "quit"]:
            print("👋 Au revoir !")
            break

        if not question:
            print("⚠️ Veuillez entrer une question.")
            continue

        try:
            answer = search_and_answer(question)

            print("\n🤖 Assistant :", answer)
            print()

        except Exception as e:
            print(f"\n❌ Erreur : {e}\n")


if __name__ == "__main__":
    main()