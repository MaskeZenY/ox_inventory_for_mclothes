import React, { useMemo } from 'react';
import { imagepath } from '../../store/imagepath';
const colorChannelMixer = (colorChannelA: number, colorChannelB: number, amountToMix: number) => {
  let channelA = colorChannelA * amountToMix;
  let channelB = colorChannelB * (1 - amountToMix);
  return channelA + channelB;
};

const colorMixer = (rgbA: number[], rgbB: number[], amountToMix: number) => {
  let r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
  let g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
  let b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
  return `rgb(${r}, ${g}, ${b})`;
};

const COLORS = {
  // Colors used - https://materialui.co/flatuicolors
  primaryColor: [231, 76, 60], // Red (Pomegranate)
  secondColor: [39, 174, 96], // Green (Nephritis)
  accentColor: [211, 84, 0], // Orange (Oragne)
};

const WeightBar: React.FC<{ percent: number; durability?: boolean; }> = ({ 
  percent, 
  durability, 
}) => {
  const color = useMemo(
    () =>
      durability
        ? percent < 50
          ? colorMixer(COLORS.accentColor, COLORS.primaryColor, percent / 100)
          : colorMixer(COLORS.secondColor, COLORS.accentColor, percent / 100)
        : percent > 50
        ? colorMixer(COLORS.primaryColor, COLORS.accentColor, percent / 100)
        : colorMixer(COLORS.accentColor, COLORS.secondColor, percent / 50),
    [durability, percent]
  );

  if (durability) {
    return (
      <div className="durability-bar">
        <div
          style={{
            visibility: percent > 0 ? 'visible' : 'hidden',
            height: '100%',
            width: `${percent}%`,
            backgroundColor: "rgba(125, 125, 125, 0.65)",
            transition: `background ${0.3}s ease, width ${0.3}s ease`,
          }}
        ></div>
      </div>
    );
  }

  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="weight-bar-circular">
        <img
         src={`${imagepath}/weight.png`}
         height="18"
         width="18"
         style={{
         position: 'absolute',
         }}
      />
      <svg width="40" height="40">
        <defs>
          <clipPath id="circleClip">
            <circle r="12" cx="20" cy="20" />
          </clipPath>
        </defs>
        <circle
          stroke="rgba(0, 0, 0, 0.4)"
          fill="transparent"
          strokeWidth="4"
          r={radius}
          cx="20"
          cy="20"
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth="4"
          r={radius}
          cx="20"
          cy="20"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
    </div>
  );
};

export default WeightBar;
