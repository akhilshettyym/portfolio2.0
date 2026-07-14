BACKEND - https://portfolio-backend-cjvf.onrender.com

ADMINUI - https://portfolio-adminui.vercel.app

IMMERSIVE CTA

https://dumemearts.com/ - Add images to cards

https://www.spasoje.dev/ - Add to Projects

Enhancements -
- Theme Modes.
- AI VOICE CHAT

---

I have few performance optimization to be done and redo things.

- you are allowed to create new components/files - If any libraries or packages(free) which could help optimize the site you are free to use them and make the appropriate changes.

- The main issue am facing right now is - Since the project is a heavy renderer. It makes use of many 3d scenes. And this is heavy for all the machines to handle. So I have implemented a tier system according to the performances of the systems. 
Now for the breakdown of whats happening in both the tiers,
In tier_2 - there are components where the jerk is felt, it is not smooth. Also while I scroll down, there are few places or times when it gets stuck for a while and then am able to scroll, this is not the right thing that should be happening, this effects the user experience. I want the user to be able to scroll smoothly and the components are visible as soon as they enter the viewport. There are few times where even after the component enters the screen and am able to see the HeroSection background, since it is acting as compound and the every other component is acting like a screen on top of it. Make sure to fix these issues, and needs more optimization for tier_2 so that the site feels smoother, Reduce animations or whatever could be effecting the performance of the site.

Coming to tier_1, here is where am facing the major issue. So teh site loads and then everything is working fine, I land on the HeroSection and the clouds are responsive and so on. And I start scrolling down, switching tabs going to newer routes and so on, when i do this the higher end laptops which should be actually able to handle this eaisly is kicking up fans as if its about to take off. Even though this is the higher tier it shouldn't be this intensive on the machine, The machine heats up and fans kick in way too hard. I want this to be resolved, The issues what I have mentioned above for tier_2 is happening for tier_1 as well. SO check this properly.


- The SEO optimization, I want the tags to be corrected, as in where we have to use nav tag, main, header, footer and so on. All the SEO required tags should be done right.

- I want a really good SEO, Performance of the site to be top notch without compromising on the user experience or animations for tier_1. Make sure to check this properly.

- I want production grade file folder system, and the updated next16+ related changes so that it is optimized and relevant.
 
- The DOM structure matters too. So make sure this is optmized as possible.

- Go thru each and every file and whatever is broken wire it properly if not broken or what could possibly break later, error handling and so on fix those.


- If I have any unwantd or redundant code or anything which is not used, then remove it completely.

- I have a component named GithubGraphQl where I am rendering the github contribution graph, I have rendered this in such a way that when the component enters the viewport only then we are showing the visual UI/UX. But here what is happening, when I route to WORK and scroll to This section API call is made, when i scroll to other section and then come back to this section again, then again the API call is made, so basically whenever the component enters the viewport an API call is being made. Which is not optimal, I dont want this to happen. Make sure to optimize this and cache the response and then use teh cached response rather than making API calls again and again. You can use any functionality to fix this, since am using next16 If using 'use cache' will help then use that else whatever could be possibly used here use that and make sure one API call happens and that is used.


- I have a component called ConsoleModal.jsx where user can type in custom commands and navigate to that section as well as data is generated in the view as well. But I feel it is not wired properly ad also the functions am importing from funct-utils is it right ot could be done better am not sure. Check and fix this.

- I have few components where I have used memo to memoize the components. If this hook is no making any work then just remove it.

- Make sure to focus on lightning-fast load times, smooth runtime interactions, and stability, the lighthouse score should be perfect, Largest contentful paint should be good every metrics should be proper. 

- Are the assets placed right ? check that 

- I have a global-error.jsx and error.jsx I just added this to check how this works, I want you to calibrate this so that it works properly witht the rest of the system.

---