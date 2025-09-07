 export function numberWithCommas(amount: number) {
     if (typeof amount !== "number" || isNaN(amount)) return "0";
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}