webpackJsonp([0x5cbf0bc32bfc],{443:function(n,s){n.exports={data:{site:{siteMetadata:{author:"Naqushab Neyazee",homeCity:"Noida"}},markdownRemark:{html:'<h2>Scenario</h2>\n<ul>\n<li>\n<p>Given seeds, crawl the web</p>\n<ul>\n<li>\n<p>How many web pages?</p>\n<ul>\n<li>1 trillion web pages</li>\n</ul>\n</li>\n<li>\n<p>How long? </p>\n<ul>\n<li>Crawl all of them every week</li>\n</ul>\n</li>\n<li>\n<p>How large?</p>\n<ul>\n<li>Average size of a web page: 10k</li>\n<li>10p web page storage</li>\n</ul>\n</li>\n</ul>\n</li>\n</ul>\n<h2>Initial design</h2>\n<h3>A simplistic news crawler</h3>\n<ul>\n<li>\n<p>Given the URL of news list page</p>\n<ol>\n<li>Send an HTTP request and grab the content of the news list page</li>\n<li>Extract all the news titles from the news list page. (Regular expressions)</li>\n</ol>\n</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-python"><code class="language-python"><span class="token keyword">import</span> urllib2\nurl <span class="token operator">=</span> <span class="token string">\'http://tech.163.com/it\'</span>\n<span class="token operator">//</span> get html\nrequest <span class="token operator">=</span> urllib2<span class="token punctuation">.</span>Request<span class="token punctuation">(</span>url<span class="token punctuation">)</span>\nresponse <span class="token operator">=</span> urllib2<span class="token punctuation">.</span>urlopen<span class="token punctuation">(</span>request<span class="token punctuation">)</span>\npage <span class="token operator">=</span> response<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token operator">//</span> extract info using regular expressions\n</code></pre>\n      </div>\n<h3>A single threaded web crawler</h3>\n<ul>\n<li>Input: Url seeds</li>\n<li>Output: List of urls</li>\n</ul>\n<h4>Overview</h4>\n<ul>\n<li><a href="http://agiliq.com/blog/2013/10/producer-consumer-problem-in-python/">Producer-consumer implementation in Python</a></li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">// breath first search, single-threaded crawler\nfunction run\n\twhile ( url_queue not empty )\n\t\turl = url_queue.dequeue()\n\t\thtml = web_page_loader.load( url ) // consume\n\t\turl_list = url_extractor.extract( html ) // produce\n\t\turl_queue.enqueue_all( url_list )\n\tend</code></pre>\n      </div>\n<h4>Initial implementation</h4>\n<ul>\n<li>Problem: At some point, consumer has consumed everything and producer is still sleeping. Consumer tries to consume more but since queue is empty, an IndexError is raised.</li>\n<li>Correct bnehavior: When there was nothing in the queue, consumer should have stopped running and waited instead of trying to consume from the queue. And once producer adds something to the queue, there should be a way for it to notify the consumer telling it has added something to queue. So, consumer can again consume from the queue. And thus IndexError will never be raised.</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-python"><code class="language-python"><span class="token keyword">from</span> threading <span class="token keyword">import</span> Thread<span class="token punctuation">,</span> Lock\n<span class="token keyword">import</span> time\n<span class="token keyword">import</span> random\n\nqueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\nlock <span class="token operator">=</span> Lock<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment"># Producer keeps on adding to the queue </span>\n<span class="token keyword">class</span> <span class="token class-name">ProducerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        nums <span class="token operator">=</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span> <span class="token comment">#Will create the list [0, 1, 2, 3, 4]</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n            num <span class="token operator">=</span> random<span class="token punctuation">.</span>choice<span class="token punctuation">(</span>nums<span class="token punctuation">)</span> <span class="token comment">#Selects a random number from list [0, 1, 2, 3, 4]</span>\n\n            <span class="token comment"># queue is kept inside lock to avoid race condition</span>\n            lock<span class="token punctuation">.</span>acquire<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            queue<span class="token punctuation">.</span>append<span class="token punctuation">(</span>num<span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Produced"</span><span class="token punctuation">,</span> num \n            lock<span class="token punctuation">.</span>release<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n<span class="token comment"># Consumer keeps on removing from the queue</span>\n<span class="token keyword">class</span> <span class="token class-name">ConsumerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n\n   \t\t\t<span class="token comment"># queue is kept inside lock to avoid race condition</span>\n            lock<span class="token punctuation">.</span>acquire<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            <span class="token keyword">if</span> <span class="token operator">not</span> queue<span class="token punctuation">:</span>\n                <span class="token keyword">print</span> <span class="token string">"Nothing in queue, but consumer will try to consume"</span>\n            num <span class="token operator">=</span> queue<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Consumed"</span><span class="token punctuation">,</span> num \n            lock<span class="token punctuation">.</span>release<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n<span class="token comment"># start one producer thread and one consumer thread</span>\nProducerThread<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>\nConsumerThread<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h4>Improve with Condition</h4>\n<ul>\n<li>\n<p>Condition object allows one or more threads to wait until notified by another thread. And this is exactly what we want. We want consumer to wait when the queue is empty and resume only when it gets notified by the producer. Producer should notify only after it adds something to the queue. So after notification from producer, we can be sure that queue is not empty and hence no error can crop if consumer consumes.</p>\n<ul>\n<li>Condition is always associated with a lock</li>\n<li>A condition has acquire() and release() methods that call the corresponding methods of the associated lock. Condition provides acquire() and release() which calls lock’s acquire() and release() internally, and so we can replace lock instances with condition instances and our lock behaviour will keep working properly.</li>\n<li>Consumer needs to wait using a condition instance and producer needs to notify the consumer using the condition instance too. So, they must use the same condition instance for the wait and notify functionality to work properly.</li>\n</ul>\n</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-python"><code class="language-python"><span class="token keyword">from</span> threading <span class="token keyword">import</span> Condition\n\ncondition <span class="token operator">=</span> Condition<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">ConsumerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n            condition<span class="token punctuation">.</span>acquire<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n            <span class="token comment"># Check if the queue is empty before consuming. If yes then call wait() on condition instance. </span>\n            <span class="token comment"># wait() blocks the consumer and also releases the lock associated with the condition. This lock was held by consumer, so basically consumer loses hold of the lock.</span>\n            <span class="token comment"># Now unless consumer is notified, it will not run.</span>\n            <span class="token keyword">if</span> <span class="token operator">not</span> queue<span class="token punctuation">:</span>\n                <span class="token keyword">print</span> <span class="token string">"Nothing in queue, consumer is waiting"</span>\n                condition<span class="token punctuation">.</span>wait<span class="token punctuation">(</span><span class="token punctuation">)</span>\n                <span class="token keyword">print</span> <span class="token string">"Producer added something to queue and notified the consumer"</span>\n            num <span class="token operator">=</span> queue<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Consumed"</span><span class="token punctuation">,</span> num \n            condition<span class="token punctuation">.</span>release<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">ProducerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        nums <span class="token operator">=</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n\t\t\t<span class="token comment"># Producer can acquire the lock because lock was released by consumer</span>\n            condition<span class="token punctuation">.</span>acquire<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n            <span class="token comment"># Producer puts data in queue and calls notify() on the condition instance.</span>\n            num <span class="token operator">=</span> random<span class="token punctuation">.</span>choice<span class="token punctuation">(</span>nums<span class="token punctuation">)</span>\n            queue<span class="token punctuation">.</span>append<span class="token punctuation">(</span>num<span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Produced"</span><span class="token punctuation">,</span> num \n\n            <span class="token comment"># Once notify() call is made on condition, consumer wakes up. But waking up doesn\'t mean it starts executing. notify() does not release the lock. Even after notify(), lock is still held by producer.</span>\n            condition<span class="token punctuation">.</span>notify<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n            <span class="token comment"># Producer explicitly releases the lock by using condition.release().</span>\n            condition<span class="token punctuation">.</span>release<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n            <span class="token comment"># And consumer starts running again. Now it will find data in queue and no IndexError will be raised.</span>\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>            \n</code></pre>\n      </div>\n<h4>Add a max size on the queue</h4>\n<div class="gatsby-highlight">\n      <pre class="language-python"><code class="language-python"><span class="token keyword">from</span> threading <span class="token keyword">import</span> Thread<span class="token punctuation">,</span> Condition\n<span class="token keyword">import</span> time\n<span class="token keyword">import</span> random\n\nqueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\nMAX_NUM <span class="token operator">=</span> <span class="token number">10</span>\ncondition <span class="token operator">=</span> Condition<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">ProducerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        nums <span class="token operator">=</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n            condition<span class="token punctuation">.</span>acquire<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n            <span class="token comment"># Before putting data in queue, producer should check if the queue is full. </span>\n            <span class="token keyword">if</span> <span class="token builtin">len</span><span class="token punctuation">(</span>queue<span class="token punctuation">)</span> <span class="token operator">==</span> MAX_NUM<span class="token punctuation">:</span>\n            \t<span class="token comment"># If the queue is full, producer must wait. So call wait() on condition instance to accomplish this.</span>\n            \t<span class="token comment"># This gives a chance to consumer to run. Consumer will consume data from queue which will create space in queue.</span>\n                <span class="token keyword">print</span> <span class="token string">"Queue full, producer is waiting"</span>\n\n                <span class="token comment"># And then consumer should notify the producer.</span>\n                condition<span class="token punctuation">.</span>wait<span class="token punctuation">(</span><span class="token punctuation">)</span>\n                <span class="token keyword">print</span> <span class="token string">"Space in queue, Consumer notified the producer"</span>\n\n            <span class="token comment"># Once consumer releases the lock, producer can acquire the lock and can add data to queue.    </span>\n            num <span class="token operator">=</span> random<span class="token punctuation">.</span>choice<span class="token punctuation">(</span>nums<span class="token punctuation">)</span>\n            queue<span class="token punctuation">.</span>append<span class="token punctuation">(</span>num<span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Produced"</span><span class="token punctuation">,</span> num\n            condition<span class="token punctuation">.</span>notify<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            condition<span class="token punctuation">.</span>release<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n\n<span class="token keyword">class</span> <span class="token class-name">ConsumerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n            condition<span class="token punctuation">.</span>acquire<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            <span class="token keyword">if</span> <span class="token operator">not</span> queue<span class="token punctuation">:</span>\n                <span class="token keyword">print</span> <span class="token string">"Nothing in queue, consumer is waiting"</span>\n                condition<span class="token punctuation">.</span>wait<span class="token punctuation">(</span><span class="token punctuation">)</span>\n                <span class="token keyword">print</span> <span class="token string">"Producer added something to queue and notified the consumer"</span>\n            num <span class="token operator">=</span> queue<span class="token punctuation">.</span>pop<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Consumed"</span><span class="token punctuation">,</span> num\n            condition<span class="token punctuation">.</span>notify<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            condition<span class="token punctuation">.</span>release<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n\nProducerThread<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>\nConsumerThread<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h4>Use a queue instead</h4>\n<ul>\n<li>Queue encapsulates the behaviour of Condition, wait(), notify(), acquire() etc.</li>\n</ul>\n<div class="gatsby-highlight">\n      <pre class="language-python"><code class="language-python"><span class="token keyword">from</span> threading <span class="token keyword">import</span> Thread\n<span class="token keyword">import</span> time\n<span class="token keyword">import</span> random\n<span class="token keyword">from</span> Queue <span class="token keyword">import</span> Queue\n\nqueue <span class="token operator">=</span> Queue<span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">ProducerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        nums <span class="token operator">=</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n            num <span class="token operator">=</span> random<span class="token punctuation">.</span>choice<span class="token punctuation">(</span>nums<span class="token punctuation">)</span>\n            <span class="token comment"># Producer uses put available on queue to insert data in the queue.</span>\n\t\t\t<span class="token comment"># put() has the logic to acquire the lock before inserting data in queue.</span>\n\t\t\t<span class="token comment"># Also put() checks whether the queue is full. If yes, then it calls wait() internally and so producer starts waiting.</span>\n            queue<span class="token punctuation">.</span>put<span class="token punctuation">(</span>num<span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Produced"</span><span class="token punctuation">,</span> num\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n\n<span class="token keyword">class</span> <span class="token class-name">ConsumerThread</span><span class="token punctuation">(</span>Thread<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">global</span> queue\n        <span class="token keyword">while</span> <span class="token boolean">True</span><span class="token punctuation">:</span>\n\t\t\t<span class="token comment"># Consumer uses get.</span>\n\t\t\t<span class="token comment"># get() acquires the lock before removing data from queue.</span>\n\t\t\t<span class="token comment"># get() checks if the queue is empty. If yes, it puts consumer in waiting state.</span>\n\t\t\t<span class="token comment"># get() and put() has proper logic for notify() too. Why don\'t you check the source code for Queue now?</span>\n            num <span class="token operator">=</span> queue<span class="token punctuation">.</span>get<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            queue<span class="token punctuation">.</span>task_done<span class="token punctuation">(</span><span class="token punctuation">)</span>\n            <span class="token keyword">print</span> <span class="token string">"Consumed"</span><span class="token punctuation">,</span> num\n            time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span>random<span class="token punctuation">.</span>random<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n\nProducerThread<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>\nConsumerThread<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<h3>A multi-threaded web crawler</h3>\n<ul>\n<li>\n<p>How different threads work together</p>\n<ul>\n<li>sleep: Stop a random interval and come back to see whether the resource is available to use. </li>\n<li>condition variable: As soon as the resource is released by other threads, you could get it immediately.</li>\n<li>semaphore: Allowing multiple number of threads to occupy a resource simultaneously. Number of semaphore set to 1. </li>\n</ul>\n</li>\n<li>\n<p>However, more threads doesn’t necessarily mean more performance. The number of threads on a single machine is limited because:</p>\n<ul>\n<li>Context switch cost ( CPU number limitation )</li>\n<li>\n<p>Thread number limitation</p>\n<ul>\n<li>TCP/IP limitation on number of threads</li>\n</ul>\n</li>\n<li>Network bottleneck for single machine</li>\n</ul>\n</li>\n</ul>\n<h3>A distributed web crawler</h3>\n<ul>\n<li>\n<p>URL queue is inside memory. Queue is too big to completely fit into memory. Use a MySQL DB task table</p>\n<ul>\n<li>state (working/idle): Whether it is being crawling.</li>\n<li>priority (1/0): </li>\n<li>available time: frequency. When to fetch the next time.</li>\n</ul>\n</li>\n</ul>\n<table>\n<thead>\n<tr>\n<th>id</th>\n<th>url</th>\n<th>state</th>\n<th>priority</th>\n<th>available_time</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1</td>\n<td>“\n<a href="http://www.sina.com/%E2%80%9D">http://www.sina.com/”</a></td>\n<td>“idle”</td>\n<td>1</td>\n<td>“2016-03-04 11:00 am”</td>\n</tr>\n<tr>\n<td>2</td>\n<td>“\n<a href="http://www.sina1.com/%E2%80%9D">http://www.sina1.com/”</a></td>\n<td>“working”</td>\n<td>1</td>\n<td>“2016-03-04 12:00 am”</td>\n</tr>\n<tr>\n<td>3</td>\n<td>“\n<a href="http://www.sina2.com/%E2%80%9D">http://www.sina2.com/”</a></td>\n<td>“idle”</td>\n<td>0</td>\n<td>“2016-03-14 02:00 pm”</td>\n</tr>\n<tr>\n<td>4</td>\n<td>“\n<a href="http://www.sina3.com/%E2%80%9D">http://www.sina3.com/”</a></td>\n<td>“idle”</td>\n<td>2</td>\n<td>“2016-03-12 04:25 am”</td>\n</tr>\n</tbody>\n</table>\n<h2>Service</h2>\n<ul>\n<li>Crawler service</li>\n<li>Task service</li>\n<li>Storage service</li>\n</ul>\n<h2>Scale</h2>\n<h3>Shard task table</h3>\n<ul>\n<li>Horizontal sharding</li>\n</ul>\n<h3>How to handle update for failure</h3>\n<ul>\n<li>\n<p>Exponential back-off</p>\n<ul>\n<li>Success: crawl after 1 week</li>\n<li>no.1 failure: crawl after 2 weeks</li>\n<li>no.2 failure: crawl after 4 weeks</li>\n<li>no.3 failure: crawl after 8 weeks</li>\n</ul>\n</li>\n</ul>\n<h3>How to handle dead cycle</h3>\n<ul>\n<li>Too many web pages in sina.com, the crawler keeps crawling sina.com and don’t crawl other websites</li>\n<li>Use quota (10%)</li>\n</ul>\n<h3>Multi-region</h3>\n<ul>\n<li>When Google’s webpage crawls China’s webpages, it will be really really slow. Deploy crawler servers in multiple regions.</li>\n</ul>',excerpt:"Scenario Given seeds, crawl the web How many web pages? 1 trillion web pages How long?  Crawl all of them every week How large? Average size…",fields:{tagSlugs:["/tags/design/","/tags/web-crawler/","/tags/python/"]},frontmatter:{title:"Designing a Web Crawler",tags:["Design","Web Crawler","Python"],date:"August 25, 2017"}}},pathContext:{slug:"/designing-web-crawler-python/"}}}});
//# sourceMappingURL=path---designing-web-crawler-python-44017baaa1d3eeb9bfe4.js.map