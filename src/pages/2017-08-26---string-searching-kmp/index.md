---
title: String Searching – The Knuth-Morris-Pratt Algorithm
tags:
  - KMP
  - String
  - Searching
  - Algorithm
date: "2017-08-26T02:19:44.000Z"
draft: false
---

We’ve seen how to do the naive approach towards pattern matching. So what about other algorithms that are much more better at doing this task? This is the **Knuth-Morris-Pratt (KMP) algorithm** for pattern matching.
 
## The Problem

The problem that we are trying to deal with, is of course, exactly the same as the naive problem. Given some pattern `p`, does it exist in some string `s`.
 
### Quick Example

Let’s say we have the following string and pattern,

```
s = “abra abracad abracadabra”
p = “abracadabra”
```

Now if this were the naive approach, we would need quite a lot of comparisons – **154** to be exact! Before we start, it would be best to note that we’ll be using zero-based arrays for this. So since `s` is really an array of characters, then `s[0]` would be referencing to the character ‘`a`’, and `p[2]` would be the character ‘`r`’.

We also need two more variables, name `i` and `j`. Here `i` will be the indexes into `p`, and `j` will be the indexes into `s`. Now, let’s start off with the first match-up,
```
j = 012345678901234567890123
s = abra abracad abracadabra
p = abracadabra
i = 01234567890
```
Here we can see that `p[0]` and `s[0]` are equal, but then we reach `s[4]` and `p[4]`. Here we have a space character and the character ‘`c`’. Clearly they don’t match up. So what we need to do now is slide the pattern along. But this is the part that isn’t like the naive approach. Instead of sliding the pattern across by one, we slide the pattern across by a special value. You see, behind the scenes there is in fact a table `T`. We’ll get to this later, but for now all you need to know is that we slide the pattern across to `j=3` and reset `i=0`.
We get the value of `j=3` from `j = j+i-T[i]` =` 0+4–1 = 3`. In this equation, `j=0` because if you remember, `j` will be the starting point. `i=4` because this is the point of failure – the position in `p` where we found our mismatch. And `T[i]=1` because, well we’ll come to this later, for now take my word for it.
With these new values, we can now slide the pattern along:
```
j = 012345678901234567890123
s = abra abracad abracadabra
p =    abracadabra
i =    01234567890
```
Now we see that we find a mismatch at `s[4]` and `p[1]`. This is we slide the pattern along to `j=4`. If you wish to know why, it’s because `j=3` and `i=1` (which should be obvious) and `T[i]=0`, sticking them into that equation gives
`j = j+i-T[i]` = `3+1–0 = 4`
Instead of drawing out all of the possible combinations, let’s jump ahead to:
```
j = 012345678901234567890123
s = abra abracad abracadabra
p =      abracadabra
i =      01234567890
```
Now this should be better to show off why this algorithm is better than the naive approach. Here we compare the characters again, and fail at `s[12]` and `p[7]`. But because of the way the algorithm works, we slide the pattern across by a huge amount,
```
j = 012345678901234567890123
s = abra abracad abracadabra
p =              abracadabra
i =              01234567890
```

I have actually skipped one step here, where we compare `s[12]` and `p[0]`. But as you can see the next step succeeds, and we find a match at `j=13`!
What’s more amazing is that we have only made **28 comparisons!** A lot better than the naive approaches **154**.
 
### So what’s this T table then!?

Well we had to get to this part sooner or later, so we may as well explain this now. Besides the obvious as to why KMP differs from the naive approach, there is another reason. You see, the KMP algorithm has a pre-processing stage, that is, that it does (or rather creates) something from the given pattern before the algorithm even starts searching for the pattern.
This pre-processing stage is the `T` table, and this is what it looked like for the above pattern:

| `i`    | 0  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|--------|----|---|---|---|---|---|---|---|---|---|----|
| `p[i]` | a  | b | r | a | c | a | d | a | b | r | a  |
| `T[i]` | -1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 1 | 2 | 3  |

Now this may look rather complex, but it really isn’t that hard to understand. First things first, the values of `T[0]` and `T[1]` are **always** fixed, they never change. Therefore, `T[0]=-1` and `T[1]=0` all of the time. This means that the main program begins from `i=2`. There is also another variable that we need to use, and we shall call this variable `sub`, with initial value of `sub=0`.
And here is some **pseudo-code to populate the T table**.
Remember. `i=2` and `sub=0`.

```
       //whilst i doesn’t exceed the length of p
001    WHILE (i < length_of_p) DO:
//we have a continued substring in p from the start of p
002        IF (p[i-1] == p[sub]) THEN:
003            sub=sub+1
004            T[i] = sub
005            i=i+1
//if the substring stops, fall back to the start
006        ELSE IF (sub > 0) THEN:
007            sub = T[sub]
//we weren’t in a substring, so use default value
008        ELSE
009            T[i] = 0
010            i=i+1
011        ENDIF
012    ENDWHILE
```

I am not going to walk through the whole process. So let’s start at `i=7 and sub=0`.
Starting at line `002` we test to see if `p[6]` is equal to `p[0]`. Since ‘`d`’ is not equal to ‘`a`’ then we move onto the next statement. Here `sub` is not greater than `0`, so we move onto the final statement. With this we make `T[7]=0` and increment `i` to `i=8`.
Now, starting back at the first **IF** statement, we test to see if `p[7]` equals `p[0]`, and by surprise it does since ‘`a`’ = ‘`a`’. This means that we increment `sub` to `sub=1`, we make `T[8]=1` and increment `i` again to `i=9`.
Moving on again, we test `p[8]` to `p[1]` this time, since `sub=1`. This time we succeed again since ‘`b`’ = ‘`b`’. Therefore we increment `sub` and `i` to `sub=2` and `i=10`. And obviously we set `T[9]=2`.
I’ll leave `T[10]` up to you, as well as the ones I missed, but it should be obvious by now how this works.
If you’re pondering why we need a `–1` at the beginning, it’s so that if we fail on the very first character, we simply move along to the next character in the main string. As if this were just `0`, we would not slide the pattern along.
 
## The Main Algorithm

Now that we understand how the `T` table is created, the main algorithm for the KMP is very simple.
First of all, we have to remember that we have `s` which is the string to search through, and `p` which is the pattern to find. Then of course we have `i` which is the current index into `p`, and `j` which is the current index into `s`.
And here is the **pseudo-code for the KMP**,

```
       //while we don’t exceed the length of string s
001    WHILE (j+i < length_of_s) DO:
//character matching for parallel characters
002        IF (p[i] == s[j+i]) THEN:
//reached the end of the pattern, match found.
003            IF (i == length_of_p –1) THEN:
004                RETURN j
005            ENDIF
006            i=i+1
//parallel characters don’t match, slide pattern along
007        ELSE
008            j=j+i-T[i]
009            IF (T[i] > –1)
010                i = T[i]
011            ELSE
012                i = 0
013            ENDIF
014        ENDIF
015    ENDWHILE
016
//we reached the end of the string, match not found
017    RETURN length_of_s
```

This may look horribly daunting at first, but it really is very simple. Line `002` is simple the character by character matching process, matching parallel characters from the pattern and the string. If we reach the end of the pattern, return the position is s where is it `(line 004)`, otherwise, we still have a character by character match, so increment to the next character in the pattern for testing `(line 006)`.
The real fun beginnings inside of the **ELSE** statement. Now line `008` should look very familiar. Yep, we came across it earlier. This line simply sets the new start position in string `s` where we start matching the pattern against it again, and of course, you now know what the `T` table looks like.
The next part, from lines `009 to 013` are a little more tricky to grasp. Basically, when we slide the pattern along, we don’t always need to re-test some of the characters from the pattern. This is because of the way the `T` table works, and it’s called backtracking. For example, if we have the following `s` and `p`:
```
j = 01234567890
s = abcdab abcd
p = abcdabd
i = 0123456
```
We can see that the initial start point will fail at `s[6]` and `p[6]`. Now because of where is failed, `T[6]` is actually equal to the value `2`. Therefore, we slide the pattern along to `j = j + i + T[i] = 0 + 6 – 2 = 4`:
```
j = 01234567890
s = abcdab abcd
p =     abcdabd
i =     0123456
```
But wait a second, we don’t need to compare the first `2` characters of `p` again, because we know that they already match up due to the `T` table. Therefore, like is says at line 010, we start at index `i = T[6] = 2`. This saves us a lot of time from doing none needed comparisons!
This backtracking only works if the value at `T[i]` is greater than `0`. Otherwise, we just start at index `i=0` in the pattern.
 
## The Complexity

So, after all of this, what is the complexity of the KMP algorithm? Well the best part is that both the pre-processing phase and the main phase run in linear time. That is, the construction of the T table takes `O(m)` time, where m is the length of the pattern p. Then, the main program itself takes `O(n)` time where `n` is the length of the string `s`. Therefore the  overall time complexity is `O(m+n)`.
 
## Resources

* [1] http://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm
* [2] University of Manchester, Advanced Algorithms 1 lecture notes by David Rydeheard
* [3] Knuth-Morris-Pratt: An Analysis by Mireille Regnier
* [4] [Badgerati Tutorials – Knuth-Morris-Pratt Algorithm](http://badgerati.com/tutorials/knuth-morris-pratt-algorithm/) 