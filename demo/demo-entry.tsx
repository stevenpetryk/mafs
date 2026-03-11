import * as React from "react"
import { createRoot } from "react-dom/client"
import { MathFlowRenderer } from "../src/mathflow/MathFlowRenderer"
import type { MathFlowPayload } from "../src/mathflow/types"

// ─── Example Payloads ───────────────────────────────────────────────

const examples: { name: string; payload: MathFlowPayload }[] = [
  {
    name: "Quadratic Explorer",
    payload: {
      id: "quadratic",
      title: "Quadratic Function Explorer",
      subtitle: "Explore how a, h, and k transform the parabola y = a(x - h)² + k",
      difficulty: "basic",
      blocks: [
        {
          type: "text",
          id: "intro",
          content:
            "Use the sliders below to change the parameters of the quadratic function. Watch how the graph transforms!",
        },
        {
          type: "slider_group",
          id: "sliders",
          config: {
            sliders: [
              { id: "a", name: "a", min: -3, max: 3, step: 0.1, default: 1, label: "Stretch (a)" },
              { id: "h", name: "h", min: -5, max: 5, step: 0.1, default: 0, label: "Horizontal shift (h)" },
              { id: "k", name: "k", min: -5, max: 5, step: 0.1, default: 0, label: "Vertical shift (k)" },
            ],
          },
        },
        {
          type: "graph",
          id: "graph",
          config: {
            viewBox: { x: [-8, 8], y: [-6, 10] },
            height: 400,
            functions: [
              { expression: "{a}*(x-{h})^2+{k}", color: "blue", weight: 3 },
              { expression: "x^2", color: "indigo", style: "dashed", weight: 1 },
            ],
            points: [{ x: "{h}", y: "{k}", color: "red", label: "vertex" }],
            annotations: [
              { position: [5, 8], label: "y = a(x−h)² + k", style: "callout", color: "blue" },
            ],
          },
        },
      ],
      steps: [
        {
          title: "The basic parabola",
          description: "Start with $a=1$, $h=0$, $k=0$. This gives us the standard parabola $y = x^2$.",
        },
        {
          title: "Vertical stretch",
          description:
            "Try changing $a$. When $|a| > 1$, the parabola gets narrower. When $|a| < 1$, it gets wider. When $a < 0$, it flips upside down!",
        },
        {
          title: "Horizontal shift",
          description:
            "Change $h$ to shift the vertex left and right. Notice: $h = 2$ shifts the vertex to $x = 2$ (opposite sign in the formula).",
        },
        {
          title: "Vertical shift",
          description: "Change $k$ to shift the vertex up and down. The vertex is always at $(h, k)$.",
        },
      ],
      challenge: {
        prompt: "Set the sliders so the vertex is at (2, -3) with the parabola opening downward.",
        type: "slider_target",
        validation: { target: [2, -3], tolerance: 0.2 },
        hints: ["h controls the x-coordinate of the vertex", "k controls the y-coordinate", "Make a negative to flip the parabola"],
      },
    },
  },
  {
    name: "Trig Functions",
    payload: {
      id: "trig",
      title: "Trigonometric Functions",
      subtitle: "Explore the unit circle and its connection to sine and cosine",
      difficulty: "intermediate",
      blocks: [
        {
          type: "text",
          content: "Drag the point around the unit circle to see how sine and cosine change.",
        },
        {
          type: "unit_circle",
          id: "circle",
          config: {
            angle: Math.PI / 4,
            showSin: true,
            showCos: true,
            showTan: true,
            showArc: true,
            draggable: true,
            labelMode: "both",
            specialAngles: true,
            width: 450,
            height: 450,
          },
        },
      ],
    },
  },
  {
    name: "Set Theory",
    payload: {
      id: "sets",
      title: "Set Operations with Venn Diagrams",
      subtitle: "Visualize union, intersection, and difference",
      difficulty: "basic",
      blocks: [
        {
          type: "text",
          content: "Click on regions of the Venn diagram to highlight them.",
        },
        {
          type: "venn",
          id: "venn",
          config: {
            sets: [
              { id: "A", label: "Set A", elements: [1, 3, 5, 7, 9], color: "var(--mafs-blue)" },
              { id: "B", label: "Set B", elements: [2, 3, 5, 8, 9], color: "var(--mafs-pink)" },
            ],
            highlights: ["intersection"],
            showElements: true,
            interactive: true,
            width: 450,
            height: 300,
          },
        },
      ],
      steps: [
        {
          title: "Intersection",
          description: "The intersection $A \\cap B$ contains elements in BOTH sets: $\\{3, 5, 9\\}$.",
        },
        {
          title: "Union",
          description: "The union $A \\cup B$ contains elements in EITHER set: $\\{1, 2, 3, 5, 7, 8, 9\\}$.",
        },
        {
          title: "Difference",
          description: "The difference $A \\setminus B$ contains elements in A but NOT in B: $\\{1, 7\\}$.",
        },
      ],
    },
  },
  {
    name: "Matrix Multiplication",
    payload: {
      id: "matrix",
      title: "Matrix Multiplication",
      subtitle: "Step-by-step 2×2 matrix multiplication",
      difficulty: "intermediate",
      blocks: [
        {
          type: "equation_steps",
          id: "steps",
          config: {
            steps: [
              {
                expression: "\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} \\cdot \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix}",
                annotation: "Start with the matrix and vector",
              },
              {
                expression: "\\begin{pmatrix} 1 \\cdot 5 + 2 \\cdot 6 \\\\ 3 \\cdot 5 + 4 \\cdot 6 \\end{pmatrix}",
                annotation: "Multiply row by column",
                highlight: "both",
              },
              {
                expression: "\\begin{pmatrix} 5 + 12 \\\\ 15 + 24 \\end{pmatrix}",
                annotation: "Compute products",
              },
              {
                expression: "\\begin{pmatrix} 17 \\\\ 39 \\end{pmatrix}",
                annotation: "Final result",
                highlight: "result",
              },
            ],
            animated: true,
            katex: true,
          },
        },
      ],
    },
  },
  {
    name: "Probability Tree",
    payload: {
      id: "probability",
      title: "Probability with Tree Diagrams",
      subtitle: "Calculate compound probabilities step by step",
      difficulty: "intermediate",
      blocks: [
        {
          type: "text",
          content:
            "A bag contains 3 red and 2 blue balls. Two balls are drawn without replacement.",
        },
        {
          type: "equation_steps",
          id: "prob-calc",
          config: {
            steps: [
              {
                expression: "P(\\text{Red}_1) = \\frac{3}{5}",
                annotation: "Probability of drawing red first",
              },
              {
                expression: "P(\\text{Red}_2 | \\text{Red}_1) = \\frac{2}{4} = \\frac{1}{2}",
                annotation: "Given first was red, probability of red again (without replacement)",
              },
              {
                expression: "P(\\text{Both Red}) = \\frac{3}{5} \\times \\frac{1}{2} = \\frac{3}{10}",
                annotation: "Multiply along the path",
                highlight: "result",
              },
            ],
            animated: true,
            katex: true,
          },
        },
      ],
    },
  },
  {
    name: "Logic",
    payload: {
      id: "logic",
      title: "Propositional Logic — Truth Tables",
      subtitle: "Evaluate logical expressions and test your understanding",
      difficulty: "basic",
      blocks: [
        {
          type: "text",
          content: "Fill in the truth table for the given logical expressions. Click cells to toggle T/F.",
        },
        {
          type: "truth_table",
          id: "table",
          config: {
            variables: ["P", "Q"],
            expressions: ["P ∧ Q", "P ∨ Q", "P → Q", "¬P"],
            interactive: true,
          },
        },
      ],
    },
  },
  {
    name: "Geometry",
    payload: {
      id: "geometry",
      title: "Triangle Properties",
      subtitle: "Explore angle and side relationships",
      difficulty: "basic",
      blocks: [
        {
          type: "graph",
          id: "triangle",
          config: {
            viewBox: { x: [-1, 6], y: [-1, 5] },
            height: 400,
            lines: [
              { from: [0, 0], to: [5, 0], color: "blue" },
              { from: [5, 0], to: [2, 4], color: "red" },
              { from: [2, 4], to: [0, 0], color: "green" },
            ],
            points: [
              { x: 0, y: 0, label: "A", color: "blue" },
              { x: 5, y: 0, label: "B", color: "red" },
              { x: 2, y: 4, label: "C", color: "green" },
            ],
            annotations: [
              { position: [2.5, -0.5], label: "c = 5", style: "minimal", color: "blue" },
              { position: [3.8, 2.3], label: "a = √13", style: "minimal", color: "red" },
              { position: [0.7, 2.3], label: "b = √20", style: "minimal", color: "green" },
            ],
          },
        },
      ],
    },
  },
  {
    name: "Equation Solving",
    payload: {
      id: "equation",
      title: "Solving Linear Equations",
      subtitle: "Step-by-step equation solving with animated reveals",
      difficulty: "basic",
      blocks: [
        {
          type: "equation_steps",
          id: "solve",
          config: {
            steps: [
              { expression: "3x + 7 = 22", annotation: "Start" },
              {
                expression: "3x = 22 - 7",
                annotation: "Subtract 7 from both sides",
                highlight: "both",
              },
              { expression: "3x = 15", annotation: "Simplify" },
              {
                expression: "x = \\frac{15}{3}",
                annotation: "Divide both sides by 3",
                highlight: "both",
              },
              { expression: "x = 5", annotation: "Solution", highlight: "result" },
            ],
            animated: true,
            katex: true,
          },
        },
      ],
      challenge: {
        prompt: "What is the solution to 3x + 7 = 22?",
        type: "free_input",
        validation: { target: "5" },
        hints: ["Isolate x by undoing operations in reverse order"],
      },
    },
  },
  {
    name: "Number Line",
    payload: {
      id: "numberline",
      title: "Inequalities on a Number Line",
      subtitle: "Visualize solution sets for inequalities",
      difficulty: "basic",
      blocks: [
        {
          type: "text",
          content: "The interval shows the solution to -2 < x ≤ 3.",
        },
        {
          type: "number_line",
          id: "nl",
          config: {
            range: [-5, 5],
            ticks: { step: 1, labels: true },
            intervals: [
              {
                start: -2,
                end: 3,
                color: "var(--mafs-blue)",
                opacity: 0.3,
                label: "(-2, 3]",
                startInclusive: false,
                endInclusive: true,
              },
            ],
            points: [
              { value: -2, label: "-2", color: "var(--mafs-blue)" },
              { value: 3, label: "3", color: "var(--mafs-blue)" },
            ],
            height: 70,
          },
        },
        {
          type: "text",
          content: "Note the open circle at -2 (not included) and filled circle at 3 (included).",
        },
      ],
    },
  },
  {
    name: "Calculus Intro",
    payload: {
      id: "calculus",
      title: "Derivative Intuition",
      subtitle: "See how the tangent line slope relates to the derivative",
      difficulty: "advanced",
      blocks: [
        {
          type: "text",
          content:
            "Move the slider to change where the tangent line touches the curve. The slope of the tangent line at x=a is the derivative f'(a).",
        },
        {
          type: "slider_group",
          id: "sliders",
          config: {
            sliders: [
              { id: "a", name: "a", min: -3, max: 3, step: 0.05, default: 1, label: "Point x = a" },
            ],
          },
        },
        {
          type: "graph",
          id: "graph",
          config: {
            viewBox: { x: [-4, 4], y: [-2, 10] },
            height: 400,
            functions: [
              { expression: "x^2", color: "blue", weight: 3 },
              { expression: "2*{a}*(x-{a})+{a}^2", color: "red", weight: 2, style: "dashed" },
            ],
            points: [{ x: "{a}", y: "{a}^2", color: "red", label: "tangent point" }],
          },
        },
        {
          type: "value_table",
          id: "values",
          config: {
            functions: [
              { expression: "x^2", label: "f(x) = x²" },
              { expression: "2*x", label: "f'(x) = 2x" },
            ],
            xValues: [-3, -2, -1, 0, 1, 2, 3],
            highlightIntersections: true,
          },
        },
      ],
      steps: [
        {
          title: "The function",
          description: "We have $f(x) = x^2$. The blue curve shows this parabola.",
        },
        {
          title: "The tangent line",
          description:
            "The red dashed line is tangent to the curve at $x = a$. Its equation is $y = f'(a)(x - a) + f(a)$.",
        },
        {
          title: "The derivative",
          description:
            "The slope of the tangent line equals $f'(a) = 2a$. Move the slider and watch how the slope changes!",
        },
      ],
    },
  },
]

// ─── App Component ──────────────────────────────────────────────────

function App() {
  const [activeTab, setActiveTab] = React.useState(0)
  const [showJson, setShowJson] = React.useState(false)

  const current = examples[activeTab]

  return (
    <div className="demo-app">
      <header className="demo-header">
        <h1 className="demo-logo">MathFlow</h1>
        <p className="demo-tagline">AI-powered interactive math visualizations, driven by JSON</p>
      </header>

      <nav className="demo-nav">
        {examples.map((ex, i) => (
          <button
            key={i}
            className={`demo-tab ${i === activeTab ? "demo-tab-active" : ""}`}
            onClick={() => {
              setActiveTab(i)
              setShowJson(false)
            }}
          >
            {ex.name}
          </button>
        ))}
      </nav>

      <div className="demo-controls">
        <button
          className="demo-json-toggle"
          onClick={() => setShowJson(!showJson)}
        >
          {showJson ? "Hide JSON" : "View JSON"}
        </button>
      </div>

      {showJson && (
        <pre className="demo-json">
          {JSON.stringify(current.payload, null, 2)}
        </pre>
      )}

      <div className="demo-renderer">
        <MathFlowRenderer
          key={current.payload.id}
          payload={current.payload}
          theme="light"
        />
      </div>
    </div>
  )
}

// ─── Mount ──────────────────────────────────────────────────────────

const container = document.getElementById("root")
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
