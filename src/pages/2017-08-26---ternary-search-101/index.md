---
title: Ternary Search Overview
tags:
  - Searching
  - Algorithm
date: "2017-08-26T02:19:44.000Z"
draft: false
---

Suppose you have a `function f` which is decreasing up to a certain point then increases (or vice versa) in the interval `[a,b]`. In the next paragraph, I assume decreasing first then increasing -- otherwise reverse the `<` and `>` signs.

So, now let's say you want to find the point `x` in `[a,b]` such that `f(x)` is a minimum (the point of the switch). At the beginning, everything in `[a,b]` is a candidate. Pick numbers thirds along the way, (so pick `g = a + (b-a)/3` and` h = a + 2*(b-a)/3`). You will calculate `f(g)` and `f(h)`. If `f(g) < f(h)`, either `g` and `h` are on opposite sides of the minimum point, or `g` and `h` are both to its right. So, we can be sure that `x` is not in `[h,b]` and can recurse on `[a,h]`. Otherwise, we can be sure that `x` is not in `[a,g]` and just recurse on `[g,b]`.

## Implementation
```
min = a;
max = b;
while(max - min > epsilon){
    g = min + (max-min)/3;
    h = min + 2*(max-min)/3;
    if(f(g) < f(h))
        max = h;
    else
        min = g;
}
return (max+min)/2;
```

## Where it'll work
Ternary search works if the function you are considering either increases upto a point c in (a,b) and then decreases, or vice-versa. **Unimodal**.

It need not be convex. For example, you can use ternary search on the following function:

```
             c     
            /\     
           /  \    
       ___/    \   
      |         \  
      |          \ 
  ___/            |
 /                |
/                 \ 
-------------------- 
a                  b 
```
although it is not convex. (Er, it can't have those horizontal segments (at least not on both sides of c), that's just a limitation of my ASCII art :) )

In short, Ternary search applies when a function is **unimodal** -- _it rises upto a point and then decreases (or the other way around -- decreases upto a point, and then begins to increase). It is used to find the point at which the extreme value occurs._

_Binary search applies to **monotonic functions**_, where the function is either increasing or decreasing throughout. It is used to find the point at which the function takes a particular value (not the extreme values, as those would just be the endpoints).
