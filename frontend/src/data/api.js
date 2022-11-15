export function getAnalysis() {
    const response = fetch("analyze");
    
    return response.then((res) => {
        if (res.status === 200) {
            return res.json();
        } else {
            return false;
        }
    })
    .catch((err) => {
        console.log(err);
        return "An unexpected error has occurred, check console for logging";
    });
}