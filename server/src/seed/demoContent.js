// Sample files and chat for the seeded rooms (copied from the Phase 1 mock data).
// room = the room code; from = the sender's email.
export const demoFiles = [
  {
    "room": "k3x-92q",
    "name": "main.cpp",
    "content": "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nconst int INF = 1e9;\n\n// Shortest paths from src, non-negative weights\nvector<int> dijkstra(int src,\n    vector<vector<pair<int,int>>>& g) {\n  priority_queue<pair<int,int>> pq;\n  vector<int> dist(g.size(), INF);\n  dist[src] = 0;\n  pq.push({0, src});\n  while (!pq.empty()) {\n    auto [d, u] = pq.top(); pq.pop();\n    if (-d > dist[u]) continue;\n    for (auto [v, w] : g[u]) {\n      if (dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        pq.push({-dist[v], v});\n      }\n    }\n  }\n  return dist;\n}\n"
  },
  {
    "room": "k3x-92q",
    "name": "graph.hpp",
    "content": "#pragma once\n#include <vector>\n\nusing Graph = std::vector<std::vector<std::pair<int,int>>>;\n"
  },
  {
    "room": "k3x-92q",
    "name": "utils.cpp",
    "content": "#include <iostream>\n\nvoid printDist(int node, int d) {\n  std::cout << node << \" : \" << d << \"\\n\";\n}\n"
  },
  {
    "room": "k3x-92q",
    "name": "input.txt",
    "content": "4 5\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n"
  },
  {
    "room": "k3x-92q",
    "name": "README.md",
    "content": "# Graph Algorithms Lab\n\nDijkstra on a weighted graph.\n"
  },
  {
    "room": "p7d-41m",
    "name": "main.cpp",
    "content": "#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << \"Hello from CodeCollab!\" << endl;\n}\n"
  },
  {
    "room": "r2b-88z",
    "name": "notes.py",
    "content": "def greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"team\"))\n"
  },
  {
    "room": "j9w-15c",
    "name": "Main.java",
    "content": "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello from CodeCollab!\");\n  }\n}\n"
  },
  {
    "room": "w4n-63h",
    "name": "app.js",
    "content": "const greet = (name) => `Hello, ${name}!`\nconsole.log(greet('class'))\n"
  },
  {
    "room": "m8t-27v",
    "name": "two_sum.py",
    "content": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n"
  }
]

export const demoMessages = [
  {
    "room": "k3x-92q",
    "from": "saad@example.com",
    "text": "Pushed the adjacency list into graph.hpp. Can someone check the edge weights in input.txt?"
  },
  {
    "room": "k3x-92q",
    "from": "leo@example.com",
    "text": "On it. Should dist be long long? Test 3 has big weights."
  },
  {
    "room": "k3x-92q",
    "from": "moiz@example.com",
    "text": "Good call. I'll switch INF to 1e18 after this run."
  },
  {
    "room": "k3x-92q",
    "type": "system",
    "text": "Sara Okafor joined the room"
  },
  {
    "room": "k3x-92q",
    "from": "saad@example.com",
    "text": "Sample input passes. I think line 19 is where test 3 overflows."
  }
]