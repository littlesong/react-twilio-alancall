
export function toPercentStr( partial, total, decimals=0){
    const p = (partial*100/total).toFixed(decimals);
    return `${p}%`;
}