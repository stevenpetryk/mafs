import * as React from "react"

interface BlockErrorBoundaryProps {
  blockId?: string
  children: React.ReactNode
}

interface BlockErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary that wraps each visualization block.
 * If a block fails to render, shows a graceful fallback
 * instead of crashing the entire renderer.
 */
export class BlockErrorBoundary extends React.Component<
  BlockErrorBoundaryProps,
  BlockErrorBoundaryState
> {
  constructor(props: BlockErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): BlockErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mafs-block-error" role="alert">
          <div className="mafs-block-error-icon">⚠</div>
          <div className="mafs-block-error-message">
            <strong>Visualization failed to render</strong>
            {this.props.blockId && <span> (block: {this.props.blockId})</span>}
          </div>
          <details className="mafs-block-error-details">
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}
