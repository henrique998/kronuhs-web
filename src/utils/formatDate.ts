import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formAtDate(date: Date) {
    const dateFormatted = format(
        date,
        "d 'de' LLLL, y",
        { locale: ptBR }
    );

    return dateFormatted
}