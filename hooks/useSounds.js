import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";

export const useSounds = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useSounds debe usarse dentro de un AudioProvider');
    }
    return context;
}