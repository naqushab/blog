webpackJsonp([0x951372d1444],{477:function(e,n){e.exports={data:{site:{siteMetadata:{author:"Naqushab Neyazee",homeCity:"Noida"}},markdownRemark:{html:'<p>Suppose you have a <code>function f</code> which is decreasing up to a certain point then increases (or vice versa) in the interval <code>[a,b]</code>. In the next paragraph, I assume decreasing first then increasing — otherwise reverse the <code>&#x3C;</code> and <code>></code> signs.</p>\n<p>So, now let’s say you want to find the point <code>x</code> in <code>[a,b]</code> such that <code>f(x)</code> is a minimum (the point of the switch). At the beginning, everything in <code>[a,b]</code> is a candidate. Pick numbers thirds along the way, (so pick <code>g = a + (b-a)/3</code> and<code>h = a + 2*(b-a)/3</code>). You will calculate <code>f(g)</code> and <code>f(h)</code>. If <code>f(g) &#x3C; f(h)</code>, either <code>g</code> and <code>h</code> are on opposite sides of the minimum point, or <code>g</code> and <code>h</code> are both to its right. So, we can be sure that <code>x</code> is not in <code>[h,b]</code> and can recurse on <code>[a,h]</code>. Otherwise, we can be sure that <code>x</code> is not in <code>[a,g]</code> and just recurse on <code>[g,b]</code>.</p>\n<h2>Implementation</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">min = a;\nmax = b;\nwhile(max - min > epsilon){\n    g = min + (max-min)/3;\n    h = min + 2*(max-min)/3;\n    if(f(g) < f(h))\n        max = h;\n    else\n        min = g;\n}\nreturn (max+min)/2;</code></pre>\n      </div>\n<h2>Where it’ll work</h2>\n<p>Ternary search works if the function you are considering either increases upto a point c in (a,b) and then decreases, or vice-versa. <strong>Unimodal</strong>.</p>\n<p>It need not be convex. For example, you can use ternary search on the following function:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">             c     \n            /\\     \n           /  \\    \n       ___/    \\   \n      |         \\  \n      |          \\ \n  ___/            |\n /                |\n/                 \\ \n-------------------- \na                  b </code></pre>\n      </div>\n<p>although it is not convex. (Er, it can’t have those horizontal segments (at least not on both sides of c), that’s just a limitation of my ASCII art :) )</p>\n<p>In short, Ternary search applies when a function is <strong>unimodal</strong> — <em>it rises upto a point and then decreases (or the other way around — decreases upto a point, and then begins to increase). It is used to find the point at which the extreme value occurs.</em></p>\n<p><em>Binary search applies to <strong>monotonic functions</strong></em>, where the function is either increasing or decreasing throughout. It is used to find the point at which the function takes a particular value (not the extreme values, as those would just be the endpoints).</p>',excerpt:"Suppose you have a  function f  which is decreasing up to a certain point then increases (or vice versa) in the interval  [a,b] . In the…",fields:{tagSlugs:["/tags/searching/","/tags/algorithm/"]},frontmatter:{title:"Ternary Search Overview",tags:["Searching","Algorithm"],date:"August 26, 2017"}}},pathContext:{slug:"/ternary-search-101/"}}}});
//# sourceMappingURL=path---ternary-search-101-3b594fcd3fd3643ddf0b.js.map