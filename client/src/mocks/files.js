const dijkstra = `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const int INF = 1e9;

// Shortest paths from src, non-negative weights
vector<int> dijkstra(int src,
    vector<vector<pair<int,int>>>& g) {
  priority_queue<pair<int,int>> pq;
  vector<int> dist(g.size(), INF);
  dist[src] = 0;
  pq.push({0, src});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (-d > dist[u]) continue;
    for (auto [v, w] : g[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push({-dist[v], v});
      }
    }
  }
  return dist;
}
`

export const mockFiles = [
  { id: 'f1', roomId: 'k3x-92q', name: 'main.cpp', content: dijkstra },
  {
    id: 'f2',
    roomId: 'k3x-92q',
    name: 'graph.hpp',
    content:
      '#pragma once\n#include <vector>\n\nusing Graph = std::vector<std::vector<std::pair<int,int>>>;\n',
  },
  {
    id: 'f3',
    roomId: 'k3x-92q',
    name: 'utils.cpp',
    content:
      '#include <iostream>\n\nvoid printDist(int node, int d) {\n  std::cout << node << " : " << d << "\\n";\n}\n',
  },
  {
    id: 'f4',
    roomId: 'k3x-92q',
    name: 'input.txt',
    content: '4 5\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n',
  },
  {
    id: 'f5',
    roomId: 'k3x-92q',
    name: 'README.md',
    content: '# Graph Algorithms Lab\n\nDijkstra on a weighted graph.\n',
  },
  {
    id: 'f6',
    roomId: 'p7d-41m',
    name: 'main.cpp',
    content:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello from CodeCollab!" << endl;\n}\n',
  },
  {
    id: 'f7',
    roomId: 'r2b-88z',
    name: 'notes.py',
    content: 'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("team"))\n',
  },
  {
    id: 'f8',
    roomId: 'j9w-15c',
    name: 'Main.java',
    content:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from CodeCollab!");\n  }\n}\n',
  },
  {
    id: 'f9',
    roomId: 'w4n-63h',
    name: 'app.js',
    content: "const greet = (name) => `Hello, ${name}!`\nconsole.log(greet('class'))\n",
  },
  {
    id: 'f10',
    roomId: 'm8t-27v',
    name: 'two_sum.py',
    content:
      'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n',
  },
]