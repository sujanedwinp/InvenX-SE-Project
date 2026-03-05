const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error(
        "[InvenX] VITE_API_URL is not defined. " +
        "Add it to frontend/.env for local dev, or set it as an Environment Variable in your Vercel project settings."
    );
}

export default API_URL;

