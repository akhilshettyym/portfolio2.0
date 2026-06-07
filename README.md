This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---


# Weather Scene Matrix

## 1. DAWN_CLEAR

### Trigger

* Dawn
* Cloud Cover: 0-40%

### Visuals

* Background: Pink → Peach → Pale Blue
* Clouds: Warm Peach White
* Lighting: Golden Sunrise
* Effects: None

---

## 2. DAWN_OVERCAST

### Trigger

* Dawn
* Cloud Cover: 40-100%

### Visuals

* Background: Muted Peach Grey
* Clouds: Warm Grey
* Lighting: Diffused Sunrise Glow
* Effects: Light Fog

---

## 3. MORNING_CLEAR

### Trigger

* Morning
* Cloud Cover: 0-40%

### Visuals

* Background: Bright Blue Sky
* Clouds: White
* Lighting: Neutral Sunlight
* Effects: None

---

## 4. MORNING_CLOUDY

### Trigger

* Morning
* Cloud Cover: 40-100%

### Visuals

* Background: Soft Blue Grey
* Clouds: Grey White
* Lighting: Soft Ambient
* Effects: Atmospheric Haze

---

## 5. RAIN

### Trigger

* Weather Code = Rain

### Visuals

* Background: Dark Grey Blue
* Clouds: Deep Grey
* Lighting: Soft Diffused
* Effects:

  * Rain
  * Mist
  * Wet Atmosphere

---

## 6. STORM

### Trigger

* Weather Code = Thunderstorm

### Visuals

* Background: Charcoal Grey
* Clouds: Almost Black
* Lighting: Low Contrast
* Effects:

  * Heavy Rain
  * Lightning
  * Dense Cloud Layer

---

## 7. AFTERNOON_CLEAR

### Trigger

* Afternoon
* Cloud Cover: 0-40%

### Visuals

* Background: Deep Vibrant Blue
* Clouds: Bright White
* Lighting: Strong Sunlight
* Effects: None

---

## 8. AFTERNOON_CLOUDY

### Trigger

* Afternoon
* Cloud Cover: 40-100%

### Visuals

* Background: Steel Blue Grey
* Clouds: Neutral Grey
* Lighting: Softened Daylight
* Effects: Haze

---

## 9. GOLDEN_HOUR

### Trigger

* One Hour Before Sunset

### Visuals

* Background: Orange → Gold
* Clouds: Gold / Copper Edge Highlights
* Lighting: Cinematic Warm Light
* Effects: Light Atmospheric Bloom

---

## 10. SUNSET

### Trigger

* Sunset Window

### Visuals

* Background: Purple → Pink → Orange
* Clouds: Pink / Orange / Purple
* Lighting: Rich Warm Rim Light
* Effects: None

---

## 11. NIGHT

### Trigger

* After Sunset

### Visuals

* Background: Midnight Blue
* Clouds: Silver Blue / Dark Grey
* Moon: Dynamic Moon Phase
* Lighting: Moonlight

### Variants

#### New Moon

* Very Dark Sky
* Clouds: Dark Blue Grey

#### Crescent Moon

* Small Crescent Visible
* Clouds: Blue Grey

#### Half Moon

* Half Moon Visible
* Clouds: Silver Blue

#### Full Moon

* Bright Moon Glow
* Clouds: Silver White
