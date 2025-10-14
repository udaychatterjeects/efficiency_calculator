from openai import AzureOpenAI
from tabulate import tabulate
import os
import dotenv

# import config
dotenv.load_dotenv()

AZURE_OPENAI_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
AZURE_OPENAI_API_KEY = os.environ["AZURE_OPENAI_API_KEY"]
AZURE_OPENAI_API_VERSION = os.environ["AZURE_OPENAI_API_VERSION"]
AZURE_OPENAI_DEPLOYMENT= os.environ["AZURE_OPENAI_DEPLOYMENT"]
OPENAI_MODEL = os.environ["OPENAI_MODEL"]


def parse_solution_details(
    solution_details: list[dict[str, str]]
) -> dict[str, list[str]]:
    solution_names = []
    stlc_names = []
    short_descriptions = []
    for solution_detail in solution_details:
        solution_names.append(solution_detail["solutionName"])
        stlc_names.append(solution_detail["stlcName"])
        short_descriptions.append(solution_detail["shortDesc"])
    solution_data = {
        "Solution Name": solution_names,
        "STLC Name": stlc_names,
        "Short Description": short_descriptions,
    }
    return solution_data


def get_prompt(input_description: str, solution_data: dict[str, list[str]]) -> str:
    prompt = (
        "Below, you will find an input description followed by a table of solution details. "
        + "Each solution has a name, a STLC (Software Testing Life Cycle) name, and a short description. "
        + "Your task is to identify solution names that are relevant to the input description based on their short descriptions.\n"
        + "Consider the following points:\n"
        + "- ONLY provide names of the solutions.\n"
        + "- DO NOT include any other text or additional information.\n\n"
        + f"Input Description:\n"
        + f"{input_description}\n\n"
        + "Solution Details:\n"
        + tabulate(solution_data, headers="keys", tablefmt="github")
    )
    return prompt


def get_response(prompt: str, response_format =  None) -> str:
    client = AzureOpenAI(
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        azure_deployment=AZURE_OPENAI_DEPLOYMENT,
        api_version=AZURE_OPENAI_API_VERSION,
        api_key=AZURE_OPENAI_API_KEY,
    )
    messages = [
        {
            "role": "system",
            "content": "You are an AI assistant designed to analyze and correlate descriptions of solutions.",
        },
        {"role": "user", "content": prompt},
    ]
    response = client.chat.completions.create(
        messages=messages,
        model=OPENAI_MODEL,
        # temperature=0,
        # max_tokens=10000,
        # top_p=0.95,
        # frequency_penalty=0,
        # presence_penalty=0,
        # stop=None,
        response_format=response_format,

        temperature=0,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        max_tokens=10000,
        stop=None
    )
    reply = response.choices[0].message.content
    return reply
