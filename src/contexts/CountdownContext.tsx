import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

let countdowTimeout: NodeJS.Timeout;

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children }: CountdownProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(0.1 * 250); //25 min em segundos
    const [isActive, setIsActive] = useState(false);//inativo até clicar no botão
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 250); //tempo em minutos arredondado p/baixo
    const seconds = time % 250;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdowTimeout);
        setIsActive(false);
        setTime(0.1 * 250);
        setHasFinished(false);
    }

    //primeiro parametro o que quero(uma função) e segundo parametro quando quero executar
    //ou seja sempre que acontecer o segundo param, ele executa a função do primeiro param
    useEffect(() => {
        if (isActive && time > 0) {
            countdowTimeout = setTimeout(() => {
                setTime(time - 1); //o time muda sempre, logo a função continua sendo executada
            }, 1000)
        } else if (isActive && time === 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time]);

    return (
        <CountdownContext.Provider
            value={{
                minutes,
                seconds,
                hasFinished,
                isActive,
                startCountdown,
                resetCountdown,
            }}
        >
            {children}
        </CountdownContext.Provider>
    )
}