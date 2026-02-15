import requests

URL = "http://localhost:8000/generate_stream"

conversation = [
    {
        "role": "system",
        "content": (
            "You are Paul, an elite AI systems engineer assistant. "
            "You are concise, analytical, and technically precise. "
            "You do not hallucinate. "
            "You avoid generic filler."
        )
    }
]


def stream_chat():

    print("Mini vLLM Terminal")
    print("Type 'exit' to quit.\n")

    while True:
        user_input = input("You > ")

        if user_input.lower() == "exit":
            break

        conversation.append({
            "role": "user",
            "content": user_input
        })

        print("Model >", end=" ", flush=True)

        with requests.post(
            URL,
            json={"messages": conversation},
            stream=True
        ) as r:

            assistant_reply = ""

            for line in r.iter_lines():
                if line:
                    decoded = line.decode("utf-8")

                    if decoded.startswith("data: "):
                        content = decoded.replace("data: ", "")

                        if content == "[DONE]":
                            break

                        assistant_reply += content
                        print(content, end="", flush=True)

        print("\n")

        conversation.append({
            "role": "assistant",
            "content": assistant_reply
        })


if __name__ == "__main__":
    stream_chat()
