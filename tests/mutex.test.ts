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
      
      expect(tracker[0]).toBe('func1');
      expect(tracker[1]).toBe('func2');
   });


   it("Should fetch and update data one by one", async() => {
      const mutex = new Mutex();
      const tracker: any[] = [];

      await Promise.all([
         (async() => {
            const release = await mutex.acquire();
            await fetch("https://official-joke-api.appspot.com/random_joke");
            tracker.push("fetch1");
            release();
         })(),
         (async() => {
            const release = await mutex.acquire();

            expect(tracker[0]).toBe("fetch1"); // should be called, after first.

            await fetch("https://official-joke-api.appspot.com/random_joke");
            tracker.push("fetch2");
            release();
         })()
      ]);
      expect(tracker[1]).toBe("fetch2");
   })
}, 10000);