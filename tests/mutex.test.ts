import Mutex from "../src/index";
import { it, describe, expect } from "vitest";

describe("Mutext", () => {

   it("Should execute functions in one by one fashion for same timeout", async() => {
      const mutex = new Mutex();
      const tracker: string[] = [];
      
      async function func1() {

         const release = await mutex.acquire();
         
         await new Promise(resolve => {
          setTimeout(() => {
              tracker.push('func1');
              release();
              resolve(null);
          }, 1000);
          });
      }
      
      async function func2() {
      
         const release = await mutex.acquire();
      
         await new Promise(resolve => {
              setTimeout(() => {
                  tracker.push('func2');
                  release();
                  resolve(null);
              }, 1000);
          });
      }
      
      await Promise.all([func1(), func2()]);
      
      expect(tracker).toHaveLength(2);
   });


   it("Should fetch and update data one by one", async() => {
      const mutex = new Mutex();
      const tracker: any[] = [];

      await Promise.all([
         (async() => {
            await fetch("https://official-joke-api.appspot.com/random_joke");

            const release = await mutex.acquire();
            tracker.push("fetch1");
            release();
         })(),
         (async() => {
            
            await fetch("https://official-joke-api.appspot.com/random_joke");

            const release = await mutex.acquire();
            tracker.push("fetch2");
            release();
         })()
      ]);
      expect(tracker).toHaveLength(2);
   })
}, 10000);