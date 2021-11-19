import React, { useContext, useEffect } from "react"
import invariant from "tiny-invariant"
import { Vector2 } from ".."

// Other types will likely want to register themselves with this context in the future
type NearbyObjectType = "MovablePoint"

interface NearbyObject {
  type: NearbyObjectType
  point: Vector2
  radius: number
}

type Objects = { [id: string]: NearbyObject }
type RegisterObject = (id: string, object: NearbyObject) => void
type UnregisterObject = (id: string) => void

export interface NearbyObjectsContextShape {
  registerObject: RegisterObject
  unregisterObject: UnregisterObject
  overlappingObjects: {
    ids: string[]
    center: Vector2
  }
}

const NearbyObjectsContext = React.createContext<NearbyObjectsContextShape | null>(null)

export function NearbyObjectsProvider({ children }: { children: React.ReactNode }) {
  const [nearbyObjects, setNearbyObjects] = React.useState<Objects>({})

  useEffect(() => {
    console.log("nearbyObjects", nearbyObjects)
  }, [nearbyObjects])

  const registerObject: RegisterObject = React.useCallback(
    (id, object) => {
      if (JSON.stringify(nearbyObjects[id]) === JSON.stringify(object)) {
        return
      }

      setNearbyObjects({
        ...nearbyObjects,
        [id]: object,
      })
    },
    [nearbyObjects]
  )

  const unregisterObject: UnregisterObject = React.useCallback(
    (id) => {
      if (!nearbyObjects[id]) return

      const newObjects = { ...nearbyObjects }
      delete newObjects[id]
      setNearbyObjects(newObjects)
    },
    [nearbyObjects]
  )

  return (
    <NearbyObjectsContext.Provider value={{ registerObject, unregisterObject }}>
      {children}
    </NearbyObjectsContext.Provider>
  )
}

export function useNearbyObjectsContext(): NearbyObjectsContextShape {
  const context = useContext(NearbyObjectsContext)

  invariant(
    context,
    "NearbyObjectsContext is not loaded. Are you rendering a Mafs component outside of a MafsView?"
  )

  return context
}

NearbyObjectsContext.displayName = "NearbyObjectsContext"

export default NearbyObjectsContext
