- Improve efficeincy of the GlobalCursor.
- If not enough processing power then fallback to normal cursor.

- Fix footer for sm, md, lg devices

update createSomething component

IMMERSIVE CTA

https://dumemearts.com/ - Add images to cards

https://www.spasoje.dev/ - Add to Projects


- Animations for component entering viewport.
- Decide wtr to build backend for Contact.


- SKIP for intro


- Design a logo
Designing and generating a logo - 
So I wanna create a logo for my site, my name is akhil shetty m, So I wanna incorporate this in the logo any initial will do no issues. But then i wanna give a touch of hanuman's gadha. I want you to subtly incorporate that into the design and create a logo. Keep the background transparent and keep in mind that these will be having a white background so let the logo be in black, and make sure to make it really cool and professional.



- Add photo to footer about - 
- Cinematic Intro scene 9 update glitch.\


Socials - 
- Landonorris for SOCIALS
- CAN - on mouse movement photo dumps


Enhancements -
- Theme Modes.
- Responsiveness.
- Clear Linting tests.
- Improve the performance of the website.
- Production grade file folder structure.


- Is there any way that I get to know wtr the users system is powerfull enough to withstand the project ? In the sense wtr the GPU or CPU is capable of handling the site's 3d renders. Before that is there a way to know wats my sites minimum requirement to run smoothly.


- AI VOICE CHAT


---

Reliability comes from consistency - Consistency comes from clarity

https://hackfirst.io/

The Hidden Vulnerabilities can destroy you

Do we need code..? or solutions ?

Adapting to pace of development environments. Sounds Interesting ?

Scroll effects - https://azizkhaldi.com/

Take points from this -  https://chkstepan.com/

---



POST BACKEND - for response
- I have this application where from frontend theres a form, which accepts details from the user and onSubmit we call the API, post request, and then this details will be stored in mongodb. And this is done here.

Now I dont have any means to know wtr the data is stored in the database. Either I should be building a small site for this, If any details gets stored then notify me. 

Give me the best approach, should I be building a site or a mobile app with expo. Whats the best approach. 

- Note that I wanna do this completely freely and I dont wanna pay. If mobile deployments where I have to pay then will cancel the mobile integration and will setup a small UI website whhich will just for fetch the data and display the details. Thats it. 

- Suggest me what I can go with now.


---


Given your requirements:

* ✅ Completely free
* ✅ Just know when new form submissions arrive
* ✅ Already storing data in MongoDB
* ✅ Don't want unnecessary complexity

I would **not** build a mobile app right now.

## Option 1 (Recommended): Build a Tiny Admin Dashboard Website ⭐⭐⭐⭐⭐

This is what I'd do.

Architecture:

```
Frontend Form
      │
      ▼
   POST /api/form
      │
      ▼
 MongoDB
      │
      ▼
Admin Dashboard
(GET /api/submissions)
      │
      ▼
Displays all submissions
```

The dashboard can literally be one page.

```
--------------------------------------
        Admin Dashboard

Total Leads: 42

--------------------------------------
John Doe
john@gmail.com
Need portfolio website
12:30 PM
--------------------------------------

Jane Smith
jane@gmail.com
Need AI app
1:45 PM
--------------------------------------

```

Tech stack:

* Next.js (you're already using it)
* MongoDB
* Tailwind
* One protected route

That's it.

No extra deployment.
No Expo.
No Play Store.
No Apple Developer account.

---

## Make it Even Better

Instead of refreshing manually every time,

Use polling.

Every 10 seconds:

```js
useEffect(() => {
  const fetchData = () => {
    ...
  }

  fetchData();

  const interval = setInterval(fetchData, 10000);

  return () => clearInterval(interval);
}, []);
```

Now whenever someone submits,

within 10 seconds

```
New Lead Appears
```

without refreshing.

---

## Even Better (Realtime)

MongoDB supports change streams (if you're using Atlas replica sets).

Or easier:

Use Socket.io

```
User submits form

↓

API stores in MongoDB

↓

socket.emit("newSubmission")

↓

Dashboard instantly updates
```

No refresh.

Looks professional.

---

## Option 2: Telegram Bot ⭐⭐⭐⭐⭐ (My Favorite)

This is honestly the simplest solution.

When someone submits:

```
POST API

↓

Store in MongoDB

↓

Send Telegram Message

↓

Done
```

Your phone receives:

```
New Contact Form

Name:
John Doe

Email:
john@gmail.com

Message:
Need a website.

Time:
12:45 PM
```

You'll know instantly.

100% FREE.

No dashboard needed.

Telegram Bot API is free forever.

---

## Option 3: Discord Webhook ⭐⭐⭐⭐☆

Same idea.

When someone submits:

```
API

↓

MongoDB

↓

Discord Webhook
```

You'll receive a notification in your Discord server.

Free.

---

## Option 4: Email Yourself ⭐⭐⭐☆

Every submission

↓

Send email

↓

Inbox

Free using services like Gmail SMTP (within limits) or other free email providers.

---

## Option 5: Mobile App (Expo)

I wouldn't.

Reasons:

You'll build:

* Authentication
* API
* Deployment
* Install APK
* Updates
* Notifications

All just to read MongoDB records.

Way too much work.

Expo is free for development, but push notifications and production workflows can introduce additional considerations over time. It's unnecessary for this use case.

---

# What I Would Build

I'd actually combine **Telegram + Admin Dashboard**.

```
User submits form
          │
          ▼
      MongoDB
      │      │
      │      ▼
      │   Telegram Notification
      │
      ▼
 Admin Dashboard
```

Benefits:

* Instant notification on your phone.
* Full history on the dashboard.
* Search.
* Delete.
* Mark as contacted.
* Filter.
* Export later if needed.

All free.

---

## Dashboard Features

It can stay extremely simple:

* 📊 Total submissions
* 📋 List of all submissions
* 🔍 Search by name/email
* 📅 Sort by newest
* 🟢 "New" badge
* ✅ Mark as contacted
* 🗑 Delete submission (optional)

This can easily be built in a few hours with Next.js.

---

## My Recommendation

Skip the mobile app for now.

Build a small Next.js admin page and protect it (for example, with a simple login or middleware). Then, add Telegram notifications from your API whenever a new submission is saved.

That gives you:

* ✅ Completely free
* ✅ Very little code
* ✅ Instant notifications on your phone
* ✅ A permanent dashboard to review all submissions
* ✅ Easy to extend later (filters, analytics, export, etc.)

Since you're already working with Next.js and MongoDB, this approach fits naturally into your existing project and avoids maintaining a separate mobile application.



---





It is a great idea to think about this before launching a heavy 3D site. If a user's system cannot handle the rendering, the browser will freeze, the fans will spin up, and the user will likely close the tab.

Here is a candid breakdown of how to find your site's minimum requirements, how to improve your current benchmark, and the industry-standard ways to handle 3D performance on the web.

---

### 1. How to Find Your Site's Minimum Requirements

Before you can measure the user's system, you need to know what your site actually demands. You cannot calculate this purely through code; you have to profile it manually.

* **Use Chrome DevTools Throttling:** Open DevTools, go to the **Performance** tab, and set CPU throttling to **4x slowdown** or **6x slowdown**. If your 3D scene drops below 30 FPS here, it will struggle on older mobile phones and budget laptops.
* **Monitor Draw Calls and Triangles:** If you are using Three.js, use a tool like `stats.js`. A general rule of thumb for smooth web performance across most devices:
* **Draw calls:** Keep under 100-200.
* **Triangle count:** Keep under 100k-500k depending on the complexity of your shaders.


* **Test on Physical Devices:** Emulators don't accurately simulate GPU bottlenecks. Borrow a 4-year-old mid-range smartphone and a basic office laptop (e.g., one with Intel UHD integrated graphics). If it runs smoothly on those, you have a solid baseline.

---

### 2. Critiquing Your Current Code

Your code tests **single-core CPU performance** and counts **logical cores**.

```javascript
// Your current benchmark
const cores = navigator.hardwareConcurrency;

```

* **The Good:** `navigator.hardwareConcurrency` is excellent for deciding how many Web Workers to spawn for background physics or data processing.
* **The Bad:** Your `getCPUSpeedScore` function runs a heavy `Math.sqrt` loop 100 million times on the main thread. **This will freeze the browser** for a noticeable amount of time before the site even loads, creating a bad user experience. Furthermore, 3D rendering is primarily **GPU-bound**, not CPU-bound. A user might have a fast CPU but a terrible integrated GPU, meaning your test would pass them, but your 3D site would still lag.

---

### 3. How to Get Accurate Data (The Right Metrics)

To know if a user can handle your 3D site, you need to test their **GPU** and their **real-time Frame Rate (FPS)**.

#### Metric A: The GPU Renderer String

You can ask the browser what graphics card the user has. You can parse this string to determine if they are on a dedicated gaming GPU (NVIDIA/AMD), an Apple Silicon chip (M1/M2/M3), or a weak integrated graphics card (Intel HD).

```javascript
function getGPUDetails() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return { vendor: 'None', renderer: 'No WebGL' };

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return { vendor, renderer };
  }
  return { vendor: 'Unknown', renderer: 'Unknown' };
}

console.log(getGPUDetails());
// Example Output: { vendor: "Google Inc. (Apple)", renderer: "ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)" }

```

* **How to use this metric:** If the renderer string contains "Intel HD", "Intel UHD", or "Mali" (budget mobile GPUs), default to lower graphics settings (disable shadows, lower pixel ratio).

#### Metric B: Dynamic Performance Scaling (The Industry Standard)

The most foolproof way to test if a user's system can handle your site is to **start rendering and measure the FPS**.

Instead of freezing the page with a pre-test, load your 3D scene but track the time between frames for the first 2 seconds.

```javascript
let frameCount = 0;
let startTime = performance.now();
let isSystemCapable = true;

function checkPerformance() {
  frameCount++;
  const elapsed = performance.now() - startTime;

  // Check the FPS after 2 seconds (2000 ms)
  if (elapsed >= 2000) {
    const fps = (frameCount / elapsed) * 1000;
    console.log(`Initial FPS: ${fps.toFixed(1)}`);

    if (fps < 30) {
      console.warn("System is struggling. Downgrading graphics...");
      isSystemCapable = false;
      // ACTION: Lower renderer.setPixelRatio(), disable shadows, or use lower-res textures.
    }
    return; // Stop checking
  }
  
  requestAnimationFrame(checkPerformance);
}

// Start the check when your 3D loop starts
requestAnimationFrame(checkPerformance);

```

### Summary of What to Consider

To ensure your site reaches its full potential without alienating users on weaker machines:

1. **Logical Cores:** Use `navigator.hardwareConcurrency >= 4` as a baseline for complex background tasks.
2. **GPU String:** Check `WEBGL_debug_renderer_info`. Default to high settings for dedicated GPUs and Apple Silicon; default to low for Intel integrated graphics.
3. **Real-time FPS:** Implement an auto-downgrade system. If FPS drops below 30 in the first few seconds, dynamically turn off shadows and post-processing (like Bloom or Depth of Field).

What specific 3D library (Three.js, Babylon, plain WebGL) are you using, and what are the heaviest elements in your scene (high-poly models, complex lighting, particle systems)?



---



Here are the concrete numbers and thresholds you should use to determine if a user’s system can handle your 3D project.

### 1. Real-Time Frame Rate (FPS)

This is the absolute most reliable metric. Measure this during the first 2–3 seconds of your 3D scene loading.

| FPS Range | User Experience | Action to Take |
| --- | --- | --- |
| **50 - 60 FPS** | Smooth and flawless. | **None.** Run the site at maximum visual quality. |
| **30 - 49 FPS** | Playable but slightly choppy. | **Monitor.** It is acceptable, but consider capping the pixel ratio to `1` on mobile screens. |
| **15 - 29 FPS** | Sluggish, causing user frustration. | **Downgrade.** Automatically turn off shadows, disable post-processing (bloom/blur), and lower texture resolution. |
| **< 15 FPS** | Unplayable, device is freezing. | **Fallback.** Hide the 3D canvas entirely and display a 2D image or looping video instead. |

---

### 2. WebGL/Three.js Scene Limits

If you want your site to hit that 60 FPS target across a wide variety of devices, you must keep your 3D scene within these numbers:

* **Draw Calls (The silent performance killer):**
* **Target:** `< 50` per frame (Ideal for mobile).
* **Maximum:** `< 100 - 200` per frame (Standard for desktop).
* **Danger Zone:** `> 500`. At this point, the CPU becomes bottlenecked trying to send instructions to the GPU, and even high-end gaming laptops will start to lag.


* **Triangle Count (Polygons):**
* **Mobile Limit:** `< 100,000 to 300,000` visible triangles.
* **Desktop Limit:** `< 1,000,000` visible triangles.



---

### 3. Your Custom CPU Benchmark

If you choose to use the `Math.sqrt` loop you provided (though I still recommend avoiding it on the main thread), JavaScript engine optimizations can skew the results. However, as a general baseline for your specific math loop:

* **High Performance:** `> 10,000 ops/ms` (Modern desktop CPUs, Apple Silicon).
* **Average:** `4,000 - 10,000 ops/ms` (Mid-range laptops, high-end smartphones).
* **Struggling:** `< 3,000 ops/ms` (Older hardware, budget phones).

---

### 4. Hardware Concurrency (Logical Cores)

You can use `navigator.hardwareConcurrency` to decide how much background work (like physics calculations or asset loading in Web Workers) you can safely run.

| Cores | Device Tier | Recommendation |
| --- | --- | --- |
| **>= 8** | High-End | Safe to run heavy Web Workers alongside your 3D scene. |
| **4 to 6** | Mid-Range | The standard baseline. Keep background tasks moderate. |
| **<= 2** | Low-End | Do not spawn heavy background workers; you will freeze the main thread. |

---

### 5. GPU Hardware Categorization

If you use the `WEBGL_debug_renderer_info` string to detect the user's graphics processor, categorize them like this:

* **Tier 1 (High-End):** Look for strings containing **"RTX"**, **"RX 6000/7000"**, **"Apple M1/M2/M3 Max/Pro"**.
* *Action:* Allow uncompromised high settings.


* **Tier 2 (Mid-Range):** Look for **"GTX"**, **"Radeon Vega"**, or base **"Apple M1/M2"**.
* *Action:* Standard settings, monitor FPS.


* **Tier 3 (Low-End / Integrated):** Look for **"Intel HD"**, **"Intel UHD"**, **"Iris"**, **"Mali"**, **"Adreno"**.
* *Action:* Default to lower settings immediately upon load to prevent the browser from freezing.