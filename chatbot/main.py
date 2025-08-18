from fastapi import FastAPI
from pydantic import BaseModel 
from dotenv import load_dotenv
import os
from openai import AzureOpenAI
app = FastAPI()


class UserResponse(BaseModel):
    user_input: str

load_dotenv()

# Retrieve environment variables
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_MODEL_NAME = os.getenv("AZURE_OPENAI_MODEL_NAME")
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")



client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version=AZURE_OPENAI_API_VERSION,
    base_url=f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_CHAT_DEPLOYMENT_NAME}"   
)

@app.post("/chatAzureOpenAI")
async def chat_azure_openai(payload : UserResponse):
    user_input = payload.user_input
    if user_input.lower() == "exit":
        return {"message": "Ending the conversation. Have a great day!"}
    response = client.chat.completions.create(
        model=AZURE_OPENAI_CHAT_DEPLOYMENT_NAME, # type: ignore
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_input} 
               
        ], max_tokens=1000
    )
    return {"response": response.choices[0].message.content}
    