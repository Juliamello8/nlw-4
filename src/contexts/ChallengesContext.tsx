//arquivos ".tsx" são usados quando é utilizado react no documento

import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json' //desafios armazenados no array challenges
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenges {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengeCompleted: number;
    experienceToNextLevel: number;
    activeChallenge: Challenges; //é um objeto o melhor é definir os dados desse objeto
    completeChallenge: () => void;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    closeLevelUpModal: () => void;
} //dados do contexto retornados

interface ChallengesProviderProps {
    children: ReactNode; //Quando tiver o "?" como children?:boolean é pq é uma propriedade opcional
    //ReactNode ele aceita qqr tipo de elemento filho, seja componente, texto, html...etc
    level: number;
    currentExperience: number;
    challengeCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({
    children,
    ...rest //o resto das propriedades tirando children
}: ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0) //experiência atual começa em 0xp
    const [challengeCompleted, setChallengeCompleted] = useState(rest.challengeCompleted ?? 0) //qtd de desafios completos

    const [activeChallenge, setActiveChallenge] = useState(null)
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2) //cálculo de level de rpg

    useEffect(() => {
        Notification.requestPermission(); //permição de notificação do browser
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengeCompleted', String(challengeCompleted))
    }, [level, currentExperience, challengeCompleted]) //sempre que houver mudanças nessas variáveis ele salva nos Cookies 

    function levelUp() {
        setLevel(level + 1)
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play //audio para notificação

        if (Notification.permission === 'granted') { //usuário permitiu notificação no browser
            new Notification('Novo Desafio', {
                body: `Valendo ${challenge.amount} xp`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return; //retorno vazio/void
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengeCompleted(challengeCompleted + 1);
    }

    return (
        //todos elementos dentro do Provider terão acesso aos dados daquele contexto
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                challengeCompleted,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                completeChallenge,
                experienceToNextLevel,
                closeLevelUpModal
            }}
        >
            {children}

            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )

}