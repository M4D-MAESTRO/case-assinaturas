
export class DateUtils {
    static getShortDate(date: Date): string {
        if (date.toString().toLowerCase().includes('inva')) {
            return null;
        }

        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const tempMonth = date.getMonth() + 1;
        const month = tempMonth < 10 ? `0${tempMonth}` : tempMonth;
        return `${day}/${month}`;
    }
}