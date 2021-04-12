
import { useContext } from 'react';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css'

export function Countdown() {
    const { minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown
    } = useContext(CountdownContext)

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondsLeft, secondsRight] = String(seconds).padStart(2, '0').split('');

    return (
        <div>
            <div className={styles.containerCountdown}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondsLeft}</span>
                    <span>{secondsRight}</span>
                </div>
            </div>
            { hasFinished ? (
                <button
                    disabled
                    type="button"
                    className={`${styles.startCountdown} ${styles.startCountdownFinished}`}
                >
                    <img src="icons/check.svg" alt="Finished" />
                    &nbsp;&nbsp; Ciclo Encerrado
                </button>
            ) : (
                <>
                    {isActive ? (
                        <button
                            type="button"
                            className={`${styles.startCountdown} ${styles.startCountdownActive}`}
                            onClick={resetCountdown}
                        >
                            Abandonar ciclo
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={styles.startCountdown}
                            onClick={startCountdown}
                        >
                            Iniciar um ciclo
                        </button>
                    )}

                </>
            )}
            {/* && no lugar do : significa que é um if sem o else */}

        </div>
    )
}