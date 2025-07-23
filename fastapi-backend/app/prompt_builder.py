"""
Prompt builder using LangChain's PromptTemplate.
"""

from langchain.prompts import PromptTemplate

def get_prompt_template() -> PromptTemplate:
    """
    Returns a LangChain prompt template for LLMChain.
    """
    template = """
        You are a knowledgeable and concise AI assistant.

        Use the provided context to answer the question as accurately and helpfully as possible.

        - If the question is short or asks for a brief response, keep your answer concise.
        - If the question implies or requests more detail, provide a thorough and well-explained answer.
        - Always ensure your response is based only on the given context.
        - Also make sure to mention the source only once used in your answer, separated by a blank line.
        - If the answer is not found in the context, then give an answer on your knowledge and give source as "LLM Answer"

        Context:
        {context}

        Question:
        {question}

        Answer:
    """

    return PromptTemplate(
        input_variables=["context", "question"],
        template=template.strip()
    )
