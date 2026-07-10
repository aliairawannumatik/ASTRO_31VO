try {
    const results = await searchIntegrations("Gemini");
    console.log("SEARCH_RESULTS:", JSON.stringify(results));
} catch (e) {
    console.error("SEARCH_ERROR:", e.message);
}
