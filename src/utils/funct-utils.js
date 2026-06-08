import { CLAMP, EASEOUTEXPO, LERP } from "./basic-utils";

export function getCardState(progress, index) {
    const enterStart = 0.08 + index * 0.08;
    const enterEnd = 0.24 + index * 0.08;

    const reverseIndex = 3 - index;
    const exitStart = 0.68 + reverseIndex * 0.05;
    const exitEnd = 0.82 + reverseIndex * 0.05;

    const rawEnter = CLAMP((progress - enterStart) / (enterEnd - enterStart), 0, 1);
    const rawExit = CLAMP((progress - exitStart) / (exitEnd - exitStart), 0, 1);

    const enterT = EASEOUTEXPO(rawEnter);
    const exitT = EASEOUTEXPO(rawExit);

    const positions = [
        { x: -360, y: 0, rotate: -10 },
        { x: -120, y: -10, rotate: -3 },
        { x: 120, y: 10, rotate: -8 },
        { x: 360, y: 0, rotate: 5 },
    ];

    const final = positions[index];
    const x = LERP(0, final.x, enterT);

    const enteredY = LERP(480, final.y, enterT);
    const exitedY = LERP(final.y, final.y - 520, exitT);
    const y = rawExit > 0 ? exitedY : enteredY;

    const scaleIn = LERP(0.82, 1, enterT);
    const scaleOut = LERP(1, 0.92, exitT);
    const scale = scaleIn * scaleOut;

    const opacity = LERP(0, 1, enterT) * LERP(1, 0, exitT);
    const rotate = LERP(0, final.rotate, enterT);
    const blur = rawExit > 0 ? LERP(0, 18, exitT) : LERP(22, 0, enterT);

    return { x, y, scale, opacity, rotate, blur, rawExit };
}