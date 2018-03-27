webpackJsonp([2316851250784],{452:function(e,t){e.exports={data:{site:{siteMetadata:{author:"Naqushab Neyazee",homeCity:"Noida"}},markdownRemark:{html:'<p>We’ve seen how to do the naive approach towards pattern matching. So what about other algorithms that are much more better at doing this task? This is the <strong>Knuth-Morris-Pratt (KMP) algorithm</strong> for pattern matching.</p>\n<h2>The Problem</h2>\n<p>The problem that we are trying to deal with, is of course, exactly the same as the naive problem. Given some pattern <code>p</code>, does it exist in some string <code>s</code>.</p>\n<h3>Quick Example</h3>\n<p>Let’s say we have the following string and pattern,</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">s = “abra abracad abracadabra”\np = “abracadabra”</code></pre>\n      </div>\n<p>Now if this were the naive approach, we would need quite a lot of comparisons – <strong>154</strong> to be exact! Before we start, it would be best to note that we’ll be using zero-based arrays for this. So since <code>s</code> is really an array of characters, then <code>s[0]</code> would be referencing to the character ‘<code>a</code>’, and <code>p[2]</code> would be the character ‘<code>r</code>’.</p>\n<p>We also need two more variables, name <code>i</code> and <code>j</code>. Here <code>i</code> will be the indexes into <code>p</code>, and <code>j</code> will be the indexes into <code>s</code>. Now, let’s start off with the first match-up,</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">j = 012345678901234567890123\ns = abra abracad abracadabra\np = abracadabra\ni = 01234567890</code></pre>\n      </div>\n<p>Here we can see that <code>p[0]</code> and <code>s[0]</code> are equal, but then we reach <code>s[4]</code> and <code>p[4]</code>. Here we have a space character and the character ‘<code>c</code>’. Clearly they don’t match up. So what we need to do now is slide the pattern along. But this is the part that isn’t like the naive approach. Instead of sliding the pattern across by one, we slide the pattern across by a special value. You see, behind the scenes there is in fact a table <code>T</code>. We’ll get to this later, but for now all you need to know is that we slide the pattern across to <code>j=3</code> and reset <code>i=0</code>.\nWe get the value of <code>j=3</code> from <code>j = j+i-T[i]</code> =<code>0+4–1 = 3</code>. In this equation, <code>j=0</code> because if you remember, <code>j</code> will be the starting point. <code>i=4</code> because this is the point of failure – the position in <code>p</code> where we found our mismatch. And <code>T[i]=1</code> because, well we’ll come to this later, for now take my word for it.\nWith these new values, we can now slide the pattern along:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">j = 012345678901234567890123\ns = abra abracad abracadabra\np =    abracadabra\ni =    01234567890</code></pre>\n      </div>\n<p>Now we see that we find a mismatch at <code>s[4]</code> and <code>p[1]</code>. This is we slide the pattern along to <code>j=4</code>. If you wish to know why, it’s because <code>j=3</code> and <code>i=1</code> (which should be obvious) and <code>T[i]=0</code>, sticking them into that equation gives\n<code>j = j+i-T[i]</code> = <code>3+1–0 = 4</code>\nInstead of drawing out all of the possible combinations, let’s jump ahead to:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">j = 012345678901234567890123\ns = abra abracad abracadabra\np =      abracadabra\ni =      01234567890</code></pre>\n      </div>\n<p>Now this should be better to show off why this algorithm is better than the naive approach. Here we compare the characters again, and fail at <code>s[12]</code> and <code>p[7]</code>. But because of the way the algorithm works, we slide the pattern across by a huge amount,</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">j = 012345678901234567890123\ns = abra abracad abracadabra\np =              abracadabra\ni =              01234567890</code></pre>\n      </div>\n<p>I have actually skipped one step here, where we compare <code>s[12]</code> and <code>p[0]</code>. But as you can see the next step succeeds, and we find a match at <code>j=13</code>!\nWhat’s more amazing is that we have only made <strong>28 comparisons!</strong> A lot better than the naive approaches <strong>154</strong>.</p>\n<h3>So what’s this T table then!?</h3>\n<p>Well we had to get to this part sooner or later, so we may as well explain this now. Besides the obvious as to why KMP differs from the naive approach, there is another reason. You see, the KMP algorithm has a pre-processing stage, that is, that it does (or rather creates) something from the given pattern before the algorithm even starts searching for the pattern.\nThis pre-processing stage is the <code>T</code> table, and this is what it looked like for the above pattern:</p>\n<table>\n<thead>\n<tr>\n<th><code>i</code></th>\n<th>0</th>\n<th>1</th>\n<th>2</th>\n<th>3</th>\n<th>4</th>\n<th>5</th>\n<th>6</th>\n<th>7</th>\n<th>8</th>\n<th>9</th>\n<th>10</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>p[i]</code></td>\n<td>a</td>\n<td>b</td>\n<td>r</td>\n<td>a</td>\n<td>c</td>\n<td>a</td>\n<td>d</td>\n<td>a</td>\n<td>b</td>\n<td>r</td>\n<td>a</td>\n</tr>\n<tr>\n<td><code>T[i]</code></td>\n<td>-1</td>\n<td>0</td>\n<td>0</td>\n<td>0</td>\n<td>1</td>\n<td>0</td>\n<td>1</td>\n<td>0</td>\n<td>1</td>\n<td>2</td>\n<td>3</td>\n</tr>\n</tbody>\n</table>\n<p>Now this may look rather complex, but it really isn’t that hard to understand. First things first, the values of <code>T[0]</code> and <code>T[1]</code> are <strong>always</strong> fixed, they never change. Therefore, <code>T[0]=-1</code> and <code>T[1]=0</code> all of the time. This means that the main program begins from <code>i=2</code>. There is also another variable that we need to use, and we shall call this variable <code>sub</code>, with initial value of <code>sub=0</code>.\nAnd here is some <strong>pseudo-code to populate the T table</strong>.\nRemember. <code>i=2</code> and <code>sub=0</code>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">       //whilst i doesn’t exceed the length of p\n001    WHILE (i < length_of_p) DO:\n//we have a continued substring in p from the start of p\n002        IF (p[i-1] == p[sub]) THEN:\n003            sub=sub+1\n004            T[i] = sub\n005            i=i+1\n//if the substring stops, fall back to the start\n006        ELSE IF (sub > 0) THEN:\n007            sub = T[sub]\n//we weren’t in a substring, so use default value\n008        ELSE\n009            T[i] = 0\n010            i=i+1\n011        ENDIF\n012    ENDWHILE</code></pre>\n      </div>\n<p>I am not going to walk through the whole process. So let’s start at <code>i=7 and sub=0</code>.\nStarting at line <code>002</code> we test to see if <code>p[6]</code> is equal to <code>p[0]</code>. Since ‘<code>d</code>’ is not equal to ‘<code>a</code>’ then we move onto the next statement. Here <code>sub</code> is not greater than <code>0</code>, so we move onto the final statement. With this we make <code>T[7]=0</code> and increment <code>i</code> to <code>i=8</code>.\nNow, starting back at the first <strong>IF</strong> statement, we test to see if <code>p[7]</code> equals <code>p[0]</code>, and by surprise it does since ‘<code>a</code>’ = ‘<code>a</code>’. This means that we increment <code>sub</code> to <code>sub=1</code>, we make <code>T[8]=1</code> and increment <code>i</code> again to <code>i=9</code>.\nMoving on again, we test <code>p[8]</code> to <code>p[1]</code> this time, since <code>sub=1</code>. This time we succeed again since ‘<code>b</code>’ = ‘<code>b</code>’. Therefore we increment <code>sub</code> and <code>i</code> to <code>sub=2</code> and <code>i=10</code>. And obviously we set <code>T[9]=2</code>.\nI’ll leave <code>T[10]</code> up to you, as well as the ones I missed, but it should be obvious by now how this works.\nIf you’re pondering why we need a <code>–1</code> at the beginning, it’s so that if we fail on the very first character, we simply move along to the next character in the main string. As if this were just <code>0</code>, we would not slide the pattern along.</p>\n<h2>The Main Algorithm</h2>\n<p>Now that we understand how the <code>T</code> table is created, the main algorithm for the KMP is very simple.\nFirst of all, we have to remember that we have <code>s</code> which is the string to search through, and <code>p</code> which is the pattern to find. Then of course we have <code>i</code> which is the current index into <code>p</code>, and <code>j</code> which is the current index into <code>s</code>.\nAnd here is the <strong>pseudo-code for the KMP</strong>,</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">       //while we don’t exceed the length of string s\n001    WHILE (j+i < length_of_s) DO:\n//character matching for parallel characters\n002        IF (p[i] == s[j+i]) THEN:\n//reached the end of the pattern, match found.\n003            IF (i == length_of_p –1) THEN:\n004                RETURN j\n005            ENDIF\n006            i=i+1\n//parallel characters don’t match, slide pattern along\n007        ELSE\n008            j=j+i-T[i]\n009            IF (T[i] > –1)\n010                i = T[i]\n011            ELSE\n012                i = 0\n013            ENDIF\n014        ENDIF\n015    ENDWHILE\n016\n//we reached the end of the string, match not found\n017    RETURN length_of_s</code></pre>\n      </div>\n<p>This may look horribly daunting at first, but it really is very simple. Line <code>002</code> is simple the character by character matching process, matching parallel characters from the pattern and the string. If we reach the end of the pattern, return the position is s where is it <code>(line 004)</code>, otherwise, we still have a character by character match, so increment to the next character in the pattern for testing <code>(line 006)</code>.\nThe real fun beginnings inside of the <strong>ELSE</strong> statement. Now line <code>008</code> should look very familiar. Yep, we came across it earlier. This line simply sets the new start position in string <code>s</code> where we start matching the pattern against it again, and of course, you now know what the <code>T</code> table looks like.\nThe next part, from lines <code>009 to 013</code> are a little more tricky to grasp. Basically, when we slide the pattern along, we don’t always need to re-test some of the characters from the pattern. This is because of the way the <code>T</code> table works, and it’s called backtracking. For example, if we have the following <code>s</code> and <code>p</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">j = 01234567890\ns = abcdab abcd\np = abcdabd\ni = 0123456</code></pre>\n      </div>\n<p>We can see that the initial start point will fail at <code>s[6]</code> and <code>p[6]</code>. Now because of where is failed, <code>T[6]</code> is actually equal to the value <code>2</code>. Therefore, we slide the pattern along to <code>j = j + i + T[i] = 0 + 6 – 2 = 4</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">j = 01234567890\ns = abcdab abcd\np =     abcdabd\ni =     0123456</code></pre>\n      </div>\n<p>But wait a second, we don’t need to compare the first <code>2</code> characters of <code>p</code> again, because we know that they already match up due to the <code>T</code> table. Therefore, like is says at line 010, we start at index <code>i = T[6] = 2</code>. This saves us a lot of time from doing none needed comparisons!\nThis backtracking only works if the value at <code>T[i]</code> is greater than <code>0</code>. Otherwise, we just start at index <code>i=0</code> in the pattern.</p>\n<h2>The Complexity</h2>\n<p>So, after all of this, what is the complexity of the KMP algorithm? Well the best part is that both the pre-processing phase and the main phase run in linear time. That is, the construction of the T table takes <code>O(m)</code> time, where m is the length of the pattern p. Then, the main program itself takes <code>O(n)</code> time where <code>n</code> is the length of the string <code>s</code>. Therefore the  overall time complexity is <code>O(m+n)</code>.</p>\n<h2>Resources</h2>\n<ul>\n<li>[1] <a href="http://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm">http://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm</a></li>\n<li>[2] University of Manchester, Advanced Algorithms 1 lecture notes by David Rydeheard</li>\n<li>[3] Knuth-Morris-Pratt: An Analysis by Mireille Regnier</li>\n<li><a href="">4</a>(<a href="http://badgerati.com/tutorials/knuth-morris-pratt-algorithm/">http://badgerati.com/tutorials/knuth-morris-pratt-algorithm/</a>) </li>\n</ul>',excerpt:"We’ve seen how to do the naive approach towards pattern matching. So what about other algorithms that are much more better at doing this…",fields:{tagSlugs:["/tags/kmp/","/tags/string/","/tags/searching/","/tags/algorithm/"]},frontmatter:{title:"String Searching – The Knuth-Morris-Pratt Algorithm",tags:["KMP","String","Searching","Algorithm"],date:"August 26, 2017"}}},pathContext:{slug:"/string-searching-kmp/"}}}});
//# sourceMappingURL=path---string-searching-kmp-3575860f4165b8748191.js.map