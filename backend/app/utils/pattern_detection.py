"""
Pattern Detection — identifies algorithmic patterns from strategy text and tags.
Also provides a curated similar-problems database.
"""

import re

PATTERN_RULES = [
    ("intervals", [r"interval", r"overlap", r"merge interval", r"meeting room"]),
    ("greedy", [r"greedy", r"locally optimal", r"jump game", r"gas station"]),
    ("sliding window", [r"sliding window", r"shrink.*window", r"window.*expand", r"contiguous subarray"]),
    ("two pointers", [r"two pointer", r"two-pointer", r"opposite end", r"left.*right pointer"]),
    ("binary search", [r"binary search", r"low.*high.*mid", r"search space", r"monotone.*condition"]),
    ("dynamic programming", [r"dynamic programming", r"\bdp\b", r"memoization", r"bottom.up", r"top.down", r"subproblem"]),
    ("bfs", [r"breadth.first", r"\bbfs\b", r"level order", r"shortest path.*graph"]),
    ("backtracking", [r"backtrack", r"permutation", r"combination sum", r"n.queen"]),
    ("dfs", [r"depth.first", r"\bdfs\b", r"flood fill", r"recursive.*grid"]),
    ("heap", [r"heap", r"priority queue", r"k largest", r"k smallest", r"min.heap", r"max.heap"]),
    ("stack", [r"monotonic stack", r"\bstack\b", r"parenthes", r"next greater", r"bracket"]),
    ("tree", [r"binary tree", r"\bbst\b", r"tree traversal", r"inorder", r"preorder", r"postorder"]),
    ("hash map", [r"hash map", r"hashmap", r"dictionary", r"frequency map", r"complement"]),
]

SIMILAR_PROBLEMS: dict[str, list[dict]] = {
    "two pointers": [
        {"id": "#11", "title": "Container With Most Water", "difficulty": "Medium", "slug": "container-with-most-water", "why": "Squeeze from both ends, maximize area"},
        {"id": "#15", "title": "3Sum", "difficulty": "Medium", "slug": "3sum", "why": "Fix one, two-pointer on rest"},
        {"id": "#42", "title": "Trapping Rain Water", "difficulty": "Hard", "slug": "trapping-rain-water", "why": "Left/right max tracking via two pointers"},
        {"id": "#167", "title": "Two Sum II", "difficulty": "Medium", "slug": "two-sum-ii-input-array-is-sorted", "why": "Two pointers on sorted array"},
        {"id": "#125", "title": "Valid Palindrome", "difficulty": "Easy", "slug": "valid-palindrome", "why": "Classic left-right pointer check"},
    ],
    "hash map": [
        {"id": "#1", "title": "Two Sum", "difficulty": "Easy", "slug": "two-sum", "why": "Canonical complement hash map"},
        {"id": "#49", "title": "Group Anagrams", "difficulty": "Medium", "slug": "group-anagrams", "why": "Group by sorted key in map"},
        {"id": "#128", "title": "Longest Consecutive Sequence", "difficulty": "Medium", "slug": "longest-consecutive-sequence", "why": "Hash set for O(1) membership"},
        {"id": "#560", "title": "Subarray Sum Equals K", "difficulty": "Medium", "slug": "subarray-sum-equals-k", "why": "Prefix sum + hash map"},
        {"id": "#242", "title": "Valid Anagram", "difficulty": "Easy", "slug": "valid-anagram", "why": "Frequency count comparison"},
    ],
    "sliding window": [
        {"id": "#3", "title": "Longest Substring Without Repeating", "difficulty": "Medium", "slug": "longest-substring-without-repeating-characters", "why": "Variable window + set"},
        {"id": "#76", "title": "Minimum Window Substring", "difficulty": "Hard", "slug": "minimum-window-substring", "why": "Variable window, character need tracking"},
        {"id": "#424", "title": "Longest Repeating Character Replacement", "difficulty": "Medium", "slug": "longest-repeating-character-replacement", "why": "Frequency-constrained window"},
        {"id": "#567", "title": "Permutation in String", "difficulty": "Medium", "slug": "permutation-in-string", "why": "Fixed-size window frequency match"},
        {"id": "#239", "title": "Sliding Window Maximum", "difficulty": "Hard", "slug": "sliding-window-maximum", "why": "Monotonic deque in window"},
    ],
    "binary search": [
        {"id": "#704", "title": "Binary Search", "difficulty": "Easy", "slug": "binary-search", "why": "Foundational binary search"},
        {"id": "#33", "title": "Search in Rotated Sorted Array", "difficulty": "Medium", "slug": "search-in-rotated-sorted-array", "why": "Binary search + rotation check"},
        {"id": "#153", "title": "Find Min in Rotated Array", "difficulty": "Medium", "slug": "find-minimum-in-rotated-sorted-array", "why": "Binary search on rotated input"},
        {"id": "#34", "title": "First and Last Position", "difficulty": "Medium", "slug": "find-first-and-last-position-of-element-in-sorted-array", "why": "Two binary searches for bounds"},
        {"id": "#875", "title": "Koko Eating Bananas", "difficulty": "Medium", "slug": "koko-eating-bananas", "why": "Binary search on answer space"},
    ],
    "dynamic programming": [
        {"id": "#70", "title": "Climbing Stairs", "difficulty": "Easy", "slug": "climbing-stairs", "why": "Fibonacci-style 1D DP"},
        {"id": "#198", "title": "House Robber", "difficulty": "Medium", "slug": "house-robber", "why": "Non-adjacent selection DP"},
        {"id": "#300", "title": "Longest Increasing Subsequence", "difficulty": "Medium", "slug": "longest-increasing-subsequence", "why": "Classic LIS DP"},
        {"id": "#322", "title": "Coin Change", "difficulty": "Medium", "slug": "coin-change", "why": "Unbounded knapsack"},
        {"id": "#1143", "title": "Longest Common Subsequence", "difficulty": "Medium", "slug": "longest-common-subsequence", "why": "2D DP on two sequences"},
        {"id": "#72", "title": "Edit Distance", "difficulty": "Medium", "slug": "edit-distance", "why": "Classic 2D string DP"},
    ],
    "bfs": [
        {"id": "#102", "title": "Binary Tree Level Order", "difficulty": "Medium", "slug": "binary-tree-level-order-traversal", "why": "Textbook BFS level processing"},
        {"id": "#200", "title": "Number of Islands", "difficulty": "Medium", "slug": "number-of-islands", "why": "BFS flood fill on grid"},
        {"id": "#994", "title": "Rotting Oranges", "difficulty": "Medium", "slug": "rotting-oranges", "why": "Multi-source BFS simulation"},
        {"id": "#127", "title": "Word Ladder", "difficulty": "Hard", "slug": "word-ladder", "why": "BFS shortest path in word graph"},
    ],
    "dfs": [
        {"id": "#200", "title": "Number of Islands", "difficulty": "Medium", "slug": "number-of-islands", "why": "DFS flood fill on grid"},
        {"id": "#695", "title": "Max Area of Island", "difficulty": "Medium", "slug": "max-area-of-island", "why": "DFS flood fill with count"},
        {"id": "#207", "title": "Course Schedule", "difficulty": "Medium", "slug": "course-schedule", "why": "Cycle detection via DFS on DAG"},
        {"id": "#210", "title": "Course Schedule II", "difficulty": "Medium", "slug": "course-schedule-ii", "why": "Topological sort via DFS"},
    ],
    "stack": [
        {"id": "#20", "title": "Valid Parentheses", "difficulty": "Easy", "slug": "valid-parentheses", "why": "Classic bracket stack matching"},
        {"id": "#155", "title": "Min Stack", "difficulty": "Medium", "slug": "min-stack", "why": "Stack tracking minimum element"},
        {"id": "#739", "title": "Daily Temperatures", "difficulty": "Medium", "slug": "daily-temperatures", "why": "Monotonic stack for next greater"},
        {"id": "#84", "title": "Largest Rectangle in Histogram", "difficulty": "Hard", "slug": "largest-rectangle-in-histogram", "why": "Monotonic stack area tracking"},
    ],
    "heap": [
        {"id": "#215", "title": "Kth Largest Element", "difficulty": "Medium", "slug": "kth-largest-element-in-an-array", "why": "Min-heap of size k"},
        {"id": "#347", "title": "Top K Frequent Elements", "difficulty": "Medium", "slug": "top-k-frequent-elements", "why": "Heap or bucket sort by frequency"},
        {"id": "#295", "title": "Find Median from Data Stream", "difficulty": "Hard", "slug": "find-median-from-data-stream", "why": "Two heaps (max+min) median"},
        {"id": "#23", "title": "Merge K Sorted Lists", "difficulty": "Hard", "slug": "merge-k-sorted-lists", "why": "Min-heap over k list heads"},
    ],
    "backtracking": [
        {"id": "#46", "title": "Permutations", "difficulty": "Medium", "slug": "permutations", "why": "Classic backtracking permutation"},
        {"id": "#78", "title": "Subsets", "difficulty": "Medium", "slug": "subsets", "why": "Power set via backtracking"},
        {"id": "#39", "title": "Combination Sum", "difficulty": "Medium", "slug": "combination-sum", "why": "Backtracking with element reuse"},
        {"id": "#79", "title": "Word Search", "difficulty": "Medium", "slug": "word-search", "why": "DFS backtracking on 2D grid"},
        {"id": "#51", "title": "N-Queens", "difficulty": "Hard", "slug": "n-queens", "why": "Classic constraint backtracking"},
    ],
    "tree": [
        {"id": "#104", "title": "Maximum Depth of Binary Tree", "difficulty": "Easy", "slug": "maximum-depth-of-binary-tree", "why": "Recursive DFS depth"},
        {"id": "#226", "title": "Invert Binary Tree", "difficulty": "Easy", "slug": "invert-binary-tree", "why": "Recursive left-right swap"},
        {"id": "#543", "title": "Diameter of Binary Tree", "difficulty": "Easy", "slug": "diameter-of-binary-tree", "why": "Longest path via DFS"},
        {"id": "#105", "title": "Construct from Preorder+Inorder", "difficulty": "Medium", "slug": "construct-binary-tree-from-preorder-and-inorder-traversal", "why": "Recursive partitioning"},
        {"id": "#124", "title": "Binary Tree Max Path Sum", "difficulty": "Hard", "slug": "binary-tree-maximum-path-sum", "why": "DFS returning max one-sided path"},
    ],
    "intervals": [
        {"id": "#57", "title": "Insert Interval", "difficulty": "Medium", "slug": "insert-interval", "why": "Merge during insertion scan"},
        {"id": "#56", "title": "Merge Intervals", "difficulty": "Medium", "slug": "merge-intervals", "why": "Sort then merge overlapping"},
        {"id": "#435", "title": "Non-overlapping Intervals", "difficulty": "Medium", "slug": "non-overlapping-intervals", "why": "Greedy: remove fewest to make disjoint"},
    ],
    "greedy": [
        {"id": "#55", "title": "Jump Game", "difficulty": "Medium", "slug": "jump-game", "why": "Track max reachable greedily"},
        {"id": "#45", "title": "Jump Game II", "difficulty": "Medium", "slug": "jump-game-ii", "why": "Min jumps via greedy BFS levels"},
        {"id": "#134", "title": "Gas Station", "difficulty": "Medium", "slug": "gas-station", "why": "Greedy start reset when deficit"},
        {"id": "#763", "title": "Partition Labels", "difficulty": "Medium", "slug": "partition-labels", "why": "Last occurrence greedy partitioning"},
    ],
}


def detect_pattern(strategy_text: str, tags: str = "") -> str:
    """Detect the primary algorithmic pattern from strategy text + tags."""
    combined = (strategy_text + " " + tags).lower()
    for pattern_name, keywords in PATTERN_RULES:
        for kw in keywords:
            if re.search(kw, combined):
                return pattern_name
    return "hash map"


def get_similar_problems(pattern: str, exclude_slug: str = "") -> list[dict]:
    """Return similar problems for a detected pattern, excluding the current one."""
    problems = SIMILAR_PROBLEMS.get(pattern, SIMILAR_PROBLEMS.get("hash map", []))
    return [p for p in problems if p["slug"] != exclude_slug]
