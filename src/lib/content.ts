import { json } from "express";

const API_URL = "http://localhost:5174/content";

/**
 * Fetch the content from the api
 * In case of an error, return content as "<speak><s>There was an error</s></speak>"
 */
const fetchContent = async (url = API_URL): Promise<string> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
       

      return JSON.stringify("<speak><s>There was an error</s></speak>",);
    }
    let content =await response.json();
    return content.content;
  } catch (error) {}
};

/**
 * Parse the content into sentences, and return an array of sentences. Look at the Readme for sample input and expected output.
 * Avoid using DOMParser for implementing this function.
 */
const parseContentIntoSentences = (content: string): string[] => {

  const cleanSentences = content.split(/[\.\?\!]+/);
  console.log("cleanSentences", cleanSentences);

  return cleanSentences;
};

export { fetchContent, parseContentIntoSentences };
