webpackJsonp([94521927528854],{447:function(e,n){e.exports={data:{site:{siteMetadata:{author:"Naqushab Neyazee",homeCity:"Noida"}},markdownRemark:{html:'<p>We will solve Producer Consumer problem in Python using Python threads. This problem is nowhere as hard as they make it sound in colleges.</p>\n<p>This will make more sense if you have some idea about <a href="http://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem">Producer Consumer problem</a>.</p>\n<p>Why care about Producer Consumer problem:</p>\n<ul>\n<li>Will help you understand more about concurrency and different concepts of concurrency.</li>\n<li>The concept of Producer Consumer problem is used to some extent in implementing a message queue. And you will surely need message queue at some point of time.</li>\n</ul>\n<p>While we use threads, you will learn about the following thread topics:</p>\n<ul>\n<li><code>Condition</code> in threads.</li>\n<li><code>wait()</code> method available on Condition instances.</li>\n<li><code>notify()</code> method available on Condition instances.</li>\n</ul>\n<p>Quoting Wikipedia:</p>\n<blockquote>\n<p>The producer’s job is to generate a piece of data, put it into the buffer and start again.\nAt the same time, the consumer is consuming the data (i.e., removing it from the buffer) one piece at a time.</p>\n</blockquote>\n<p>The catch here is “At the same time”. So, producer and consumer need to run concurrently. Hence we need separate threads for Producer and Consumer.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">from threading import Thread\n\nclass ProducerThread(Thread):\n    def run(self):\n        pass\n\nclass ConsumerThread(Thread):\n    def run(self):\n        pass</code></pre>\n      </div>\n<p>Quoting Wikipedia again:</p>\n<blockquote>\n<p>The problem describes two processes, the producer and the consumer, who share a common, fixed-size buffer used as a queue.</p>\n</blockquote>\n<p>So we keep one variable which will be global and will be modified by both Producer and Consumer threads. Producer produces data and adds it to the queue. Consumer consumes data from the queue i.e removes it from the queue.</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">queue = []</code></pre>\n      </div>\n<p>In first iteration, we will not put fixed-size constraint on queue. We will make it fixed-size once our basic program works.</p>\n<h2>Initial buggy program:</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">from threading import Thread, Lock\nimport time\nimport random\n\nqueue = []\nlock = Lock()\n\nclass ProducerThread(Thread):\n    def run(self):\n        nums = range(5) #Will create the list [0, 1, 2, 3, 4]\n        global queue\n        while True:\n            num = random.choice(nums) #Selects a random number from list [0, 1, 2, 3, 4]\n            lock.`acquire()`\n            queue.append(num)\n            print "Produced", num \n            lock.`release()`\n            time.sleep(random.random())\n\n\nclass ConsumerThread(Thread):\n    def run(self):\n        global queue\n        while True:\n            lock.`acquire()`\n            if not queue:\n                print "Nothing in queue, but consumer will try to consume"\n            num = queue.pop(0)\n            print "Consumed", num \n            lock.`release()`\n            time.sleep(random.random())\n\n\nProducerThread().start()\nConsumerThread().start()</code></pre>\n      </div>\n<p>Run it few times and notice the result. Your program might not end after raising <strong><code>IndexError</code></strong>. Use <strong>Ctrl+Z</strong> to terminate.</p>\n<h3>Sample output:</h3>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">Produced 3\nConsumed 3\nProduced 4\nConsumed 4\nProduced 1\nConsumed 1\nNothing in queue, but consumer will try to consume\nException in thread Thread-2:\nTraceback (most recent call last):\n  File "/usr/lib/python2.7/threading.py", line 551, in __bootstrap_inner\n    self.run()\n  File "producer_consumer.py", line 31, in run\n    num = queue.pop(0)\nIndexError: pop from empty list</code></pre>\n      </div>\n<h3>Explanation</h3>\n<ul>\n<li>We started one producer thread(hereafter referred as producer) and one consumer thread(hereafter referred as consumer).</li>\n<li>Producer keeps on adding to the queue and consumer keeps on removing from the queue.</li>\n<li>Since queue is a shared variable, we keep it inside lock to avoid race condition.</li>\n<li>At some point, consumer has consumed everything and producer is still sleeping. Consumer tries to consume more but since queue is empty, an <code>IndexError</code> is raised.</li>\n<li>But on every execution, before <code>IndexError</code> is raised you will see the print statement telling “Nothing in queue, but consumer will try to consume”, which explains why you are getting the error.\nWe found this implementaion as the wrong behaviour.</li>\n</ul>\n<h3>What is the correct behaviour?</h3>\n<p>When there was nothing in the queue, consumer should have stopped running and waited instead of trying to consume from the queue. And once producer adds something to the queue, there should be a way for it to notify the consumer telling it has added something to queue. So, consumer can again consume from the queue. And thus <code>IndexError</code> will never be raised.</p>\n<h2>About Condition</h2>\n<ul>\n<li>\n<p>Condition object allows one or more threads to wait until notified by another thread. Taken from <a href="http://docs.python.org/2/library/threading.html#condition-objects">here</a>.\nAnd this is exactly what we want. We want consumer to wait when the queue is empty and resume only when it gets notified by the producer. Producer should notify only after it adds something to the queue. So after notification from producer, we can be sure that queue is not empty and hence no error can crop if consumer consumes.</p>\n</li>\n<li>\n<p>Condition is always associated with a lock.</p>\n</li>\n<li>\n<p>A condition has <code>acquire()</code> and <code>release()</code> methods that call the corresponding methods of the associated lock.\nCondition provides <code>acquire()</code> and <code>release()</code> which calls lock’s <code>acquire()</code> and <code>release()</code> internally, and so we can replace lock instances with condition instances and our lock behaviour will keep working properly.</p>\n</li>\n</ul>\n<p>Consumer needs to wait using a condition instance and producer needs to notify the consumer using the condition instance too. So, they must use the same condition instance for the wait and notify functionality to work properly.</p>\n<p><strong>Let’s rewrite our Consumer and Producer code:</strong></p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">from threading import Condition\n\ncondition = Condition()\n\nclass ConsumerThread(Thread):\n    def run(self):\n        global queue\n        while True:\n            condition.`acquire()`\n            if not queue:\n                print "Nothing in queue, consumer is waiting"\n                condition.wait()\n                print "Producer added something to queue and notified the consumer"\n            num = queue.pop(0)\n            print "Consumed", num \n            condition.`release()`\n            time.sleep(random.random())</code></pre>\n      </div>\n<p>Let’s rewrite <strong>Producer code</strong>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">class ProducerThread(Thread):\n    def run(self):\n        nums = range(5)\n        global queue\n        while True:\n            condition.`acquire()`\n            num = random.choice(nums)\n            queue.append(num)\n            print "Produced", num \n            condition.`notify()`\n            condition.`release()`\n            time.sleep(random.random())</code></pre>\n      </div>\n<p><strong>Sample output:</strong></p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">Produced 3\nConsumed 3\nProduced 1\nConsumed 1\nProduced 4\nConsumed 4\nProduced 3\nConsumed 3\nNothing in queue, consumer is waiting\nProduced 2\nProducer added something to queue and notified the consumer\nConsumed 2\nNothing in queue, consumer is waiting\nProduced 2\nProducer added something to queue and notified the consumer\nConsumed 2\nNothing in queue, consumer is waiting\nProduced 3\nProducer added something to queue and notified the consumer\nConsumed 3\nProduced 4\nConsumed 4\nProduced 1\nConsumed 1</code></pre>\n      </div>\n<h3>Explanation:</h3>\n<ul>\n<li>For consumer, we check if the queue is empty before consuming.</li>\n<li>If yes then call wait() on condition instance.</li>\n<li>wait() blocks the consumer and also releases the lock associated with the condition. This lock was held by consumer, so basically consumer loses hold of the lock.</li>\n<li>Now unless consumer is notified, it will not run.</li>\n<li>Producer can acquire the lock because lock was released by consumer.</li>\n<li>Producer puts data in queue and calls <code>notify()</code> on the condition instance.</li>\n<li>Once <code>notify()</code> call is made on condition, consumer wakes up. But waking up doesn’t mean it starts executing.</li>\n<li><code>notify()</code> does not release the lock. Even after <code>notify()</code>, lock is still held by producer.</li>\n<li>Producer explicitly releases the lock by using condition.<code>release()</code>.</li>\n<li>And consumer starts running again. Now it will find data in queue and no IndexError will be raised.</li>\n</ul>\n<h2>Adding a max size on the queue</h2>\n<p>Producer should not put data in the queue if the queue is full.</p>\n<p>It can be accomplished in the following way:</p>\n<ul>\n<li>Before putting data in queue, producer should check if the queue is full.</li>\n<li>If not, producer can continue as usual.</li>\n<li>If the queue is full, producer must wait. So call <code>wait()</code> on condition instance to accomplish this.</li>\n<li>This gives a chance to consumer to run. Consumer will consume data from queue which will create space in queue.</li>\n<li>And then consumer should notify the producer.</li>\n<li>Once consumer releases the lock, producer can acquire the lock and can add data to queue.</li>\n</ul>\n<h2>Final program looks like:</h2>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">from threading import Thread, Condition\nimport time\nimport random\n\nqueue = []\nMAX_NUM = 10\ncondition = Condition()\n\nclass ProducerThread(Thread):\n    def run(self):\n        nums = range(5)\n        global queue\n        while True:\n            condition.`acquire()`\n            if len(queue) == MAX_NUM:\n                print "Queue full, producer is waiting"\n                condition.wait()\n                print "Space in queue, Consumer notified the producer"\n            num = random.choice(nums)\n            queue.append(num)\n            print "Produced", num\n            condition.`notify()`\n            condition.`release()`\n            time.sleep(random.random())\n\n\nclass ConsumerThread(Thread):\n    def run(self):\n        global queue\n        while True:\n            condition.`acquire()`\n            if not queue:\n                print "Nothing in queue, consumer is waiting"\n                condition.wait()\n                print "Producer added something to queue and notified the consumer"\n            num = queue.pop(0)\n            print "Consumed", num\n            condition.`notify()`\n            condition.`release()`\n            time.sleep(random.random())\n\n\nProducerThread().start()\nConsumerThread().start()</code></pre>\n      </div>\n<h3>Sample output:</h3>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">Produced 0\nConsumed 0\nProduced 0\nProduced 4\nConsumed 0\nConsumed 4\nNothing in queue, consumer is waiting\nProduced 4\nProducer added something to queue and notified the consumer\nConsumed 4\nProduced 3\nProduced 2\nConsumed 3</code></pre>\n      </div>\n<h3>Implementation using Queue</h3>\n<p>Let’s update our code to use Queue.</p>\n<p>Queue encapsulates the behaviour of Condition, <code>wait()</code>, <code>notify()</code>, <code>acquire()</code> etc.</p>\n<p>Now is a good time to read the <a href="http://docs.python.org/2/library/queue.html">documentation for Queue</a> and the source code for it.</p>\n<h3>Updated program:</h3>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code class="language-none">from threading import Thread\nimport time\nimport random\nfrom Queue import Queue\n\nqueue = Queue(10)\n\nclass ProducerThread(Thread):\n    def run(self):\n        nums = range(5)\n        global queue\n        while True:\n            num = random.choice(nums)\n            queue.put(num)\n            print "Produced", num\n            time.sleep(random.random())\n\n\nclass ConsumerThread(Thread):\n    def run(self):\n        global queue\n        while True:\n            num = queue.get()\n            queue.task_done()\n            print "Consumed", num\n            time.sleep(random.random())\n\n\nProducerThread().start()\nConsumerThread().start()</code></pre>\n      </div>\n<h3>Explanation</h3>\n<ul>\n<li>In place of list, we are using a Queue instance(hereafter queue).</li>\n<li>queue has a <strong>Condition</strong> and that condition has its lock. You don’t need to bother about Condition and Lock if you use Queue.</li>\n<li>Producer uses put available on queue to insert data in the queue.</li>\n<li><code>put()</code> has the logic to acquire the lock before inserting data in queue.</li>\n<li>Also <code>put()</code> checks whether the queue is full. If yes, then it calls <code>wait()</code> internally and so producer starts waiting.</li>\n<li>Consumer uses get.</li>\n<li><code>get()</code> acquires the lock before removing data from queue.</li>\n<li><code>get()</code> checks if the queue is empty. If yes, it puts consumer in waiting state.</li>\n<li><code>get()</code> and <code>put()</code> has proper logic for <code>notify()</code> too. Why don’t you check the source code for Queue now?</li>\n</ul>',excerpt:"We will solve Producer Consumer problem in Python using Python threads. This problem is nowhere as hard as they make it sound in colleges…",fields:{tagSlugs:["/tags/producer-consumer/","/tags/multi-threading/","/tags/python/"]},frontmatter:{title:"Producer Consumer Problem in Python",tags:["Producer Consumer","Multi Threading","Python"],date:"August 25, 2017"}}},pathContext:{slug:"/producer-consumer-problem/"}}}});
//# sourceMappingURL=path---producer-consumer-problem-b983c8a8e6b24e57d423.js.map