import { ToastEnum, ToastIonicSeverityEnum, ToastPrimeSeverityEnum,  } from "../../constants/toast.constant";

export interface ToastMessageDto{
    gravidade: ToastPrimeSeverityEnum,
    titulo: string,
    detalhe: string,
    duracao: ToastEnum
}

export interface ToastNotificacoDto{
    gravidade: ToastIonicSeverityEnum,
    titulo: string,
    detalhe: string,
    duracao: ToastEnum
}