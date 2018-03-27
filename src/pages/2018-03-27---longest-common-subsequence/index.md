---
title: Longest Common Subsequence
tags:
  - Dynamic-Programming
  - Algorithms
date: "2018-03-27T02:19:44.000Z"
draft: false
---

The longest common subsequence (LCS) problem is the problem of finding the longest subsequence that is present in given two sequences in the same order. i.e. find a longest sequence which can be obtained from the first original sequence by deleting some items, and from the second original sequence by deleting other items.

The problem differs from problem of finding common substrings. Unlike substrings, subsequences are not required to occupy consecutive positions within the original sequences.
For example, consider the two following sequences X and Y

X: ABCBDAB
Y: BDCABA


The length of LCS is 4
LCS are BDAB, BCAB and BCBA

The LCS problem has an optimal substructure. That means the problem can be broken down into smaller, simple “subproblems”, which can be broken down into yet simpler subproblems, and so on, until, finally, the solution becomes trivial.
 

1. Let us consider two sequences X and Y of length m and n that both end in the same element.
To find their LCS, shorten each sequence by removing the last element, find the LCS of the shortened sequences, and to that LCS append the removed element. So we can say that

`LCS(X[1..m], Y[1..n]) = LCS(X[1..m-1], Y[1..n-1]) + X[m]   if X[m] = Y[n]`

2. Now suppose that the two sequences do not end in the same symbol.
Then the LCS of X and Y is the longer of the two sequences LCS(X[1..m-1], Y[1..n]) and LCS(X[1..m], Y[1..n-1]). To understand this property, let’s consider the two following sequences
X: ABCBDAB (n elements)
Y: BDCABA  (m elements)

The LCS of these two sequences either ends with a B (the last element of sequence X) or does not.

Case 1: If LCS ends with a B, then it cannot end with a A and we can remove the A from sequence Y and the problem reduces to `LCS(X[1..m], Y[1..n-1])`.

Case 2: If LCS does not end with a B, then we can remove B from the sequence X and the problem reduces to `LCS(X[1..m-1], Y[1..n])`. For example,

```
LCS(‘ABCBDAB’, ‘BDCABA’) = maximum (LCS(‘ABCBDA’, ‘BDCABA’),
                                    LCS(‘ABCBDAB’, ‘BDCAB’))
LCS(‘ABCBDA’, ‘BDCABA’) = LCS(‘ABCBD’, ‘BDCAB’) + ‘A’
LCS(‘ABCBDAB’, ‘BDCAB’) = LCS(‘ABCBDA’, ‘BDCA’) + ‘B’

LCS(‘ABCBD’, ‘BDCAB’) = maximum (LCS(‘ABCB’, ‘BDCAB’), LCS(‘ABCBD’, ‘BDCA’))
LCS(‘ABCBDA’, ‘BDCA’) = LCS(‘ABCBD’, ‘BDC’) + ‘A’

```
and so on..


## Implementation

### Top Down

```

#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

// Function to find length of Longest Common Subsequence of substring
// X[0..m-1] and Y[0..n-1]
int LCSLength(string X, string Y, int m, int n, auto &lookup)
{
    // return if we have reached the end of either string
    if (m == 0 || n == 0)
        return 0;

    // construct a unique map key from dynamic elements of the input
    string key = to_string(m) + "|" + to_string(n);

    // if sub-problem is seen for the first time, solve it and
    // store its result in a map
    if (lookup.find(key) == lookup.end())
    {
        // if last character of X and Y matches
        if (X[m - 1] == Y[n - 1])
            lookup[key] = LCSLength(X, Y, m - 1, n - 1, lookup) + 1;

        else
        // else if last character of X and Y don't match
        lookup[key] = max(LCSLength(X, Y, m, n - 1, lookup),
                          LCSLength(X, Y, m - 1, n, lookup));
    }

    // return the subproblem solution from the map
    return lookup[key];
}

// Longest Common Subsequence
int main()
{
    string X = "ABCBDAB", Y = "BDCABA";

    // create a map to store solutions of subproblems
    unordered_map<string, int> lookup;

    cout << "The length of LCS is "
        << LCSLength(X, Y, X.length(), Y.length(), lookup);

    return 0;
}

```

The time complexity of above solution is O(mn) and auxiliary space used by the program is O(mn). 

### Bottom Up

In the bottom-up approach, we calculate the smaller values of LCS(i, j) first, then build larger values from them.

```
            | 0                                          if i == 0 or j == 0
LCS[i][j] = | LCS[i – 1][j – 1] + 1                      if X[i-1] == Y[j-1]
            | longest(LCS[i – 1][j], LCS[i][j – 1])      if X[i-1] != Y[j-1]
```

```

#include <iostream>
#include <string>
using namespace std;

// Function to find length of Longest Common Subsequence of substring
// X[0..m-1] and Y[0..n-1]
int LCSLength(string X, string Y)
{
    int m = X.length(), n = Y.length();

    // lookup table stores solution to already computed sub-problems
    // i.e. lookup[i][j] stores the length of LCS of substring
    // X[0..i-1] and Y[0..j-1]
    int lookup[m + 1][n + 1];

    // first column of the lookup table will be all 0
    for (int i = 0; i <= m; i++)
        lookup[i][0] = 0;

    // first row of the lookup table will be all 0
    for (int j = 0; j <= n; j++)
        lookup[0][j] = 0;

    // fill the lookup table in bottom-up manner
    for (int i = 1; i <= m; i++)
    {
        for (int j = 1; j <= n; j++)
        {
            // if current character of X and Y matches
            if (X[i - 1] == Y[j - 1])
                lookup[i][j] = lookup[i - 1][j - 1] + 1;

            // else if current character of X and Y don't match
            else
                lookup[i][j] = max(lookup[i - 1][j], lookup[i][j - 1]);
        }
    }

    // LCS will be last entry in the lookup table
    return lookup[m][n];
}

// Longest Common Subsequence
int main()
{
    string X = "XMJYAUZ", Y = "MZJAWXU";

    cout << "The length of LCS is " << LCSLength(X, Y);

    return 0;
}

```

The time complexity of above solution is O(mn) and auxiliary space used by the program is O(mn). The space compexity of above solution can be improved to O(n) as calculating LCS of a row of the LCS table requires only the solutions to the current row and the previous row.

