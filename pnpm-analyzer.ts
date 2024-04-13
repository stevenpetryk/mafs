/* eslint-disable no-undef */
/* eslint-disable no-console */
// @ts-check

import fs from "fs"
import { parse } from "yaml"

type Dependency = {
  specifier: string
  version: string
}

type Dependencies = {
  [depName: string]: Dependency
}

type Importer = {
  dependencies?: Dependencies
  devDependencies?: Dependencies
  peerDependencies?: Dependencies
  optionalDependencies?: Dependencies
}

type Package = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

type Lockfile = {
  importers: {
    [importerId: string]: Importer
  }

  packages: {
    [packageId: string]: Package
  }
}

class Graph {
  lockfile: Lockfile

  /**
   * For each package (indexed by ID), store the set of top-level dependencies
   * that depend on it (directly or indirectly).
   */
  packageReachabilities: Record<string, Set<string>> = {}

  constructor(lockfile: Lockfile) {
    this.lockfile = lockfile
  }

  solve() {
    const start = performance.now()
    const importers = Object.entries(this.lockfile.importers)
    const packages = Object.entries(this.lockfile.packages)
    console.log(importers.length, packages.length)

    for (const [importerId, importer] of importers) {
      const combinedDeps = [
        ...Object.entries(importer.dependencies ?? {}),
        ...Object.entries(importer.devDependencies ?? {}),
        ...Object.entries(importer.optionalDependencies ?? {}),
      ]

      for (const [depName, dep] of combinedDeps) {
        const packageId = `/${depName}@${dep.version}`
        this.traverse(`${importerId}${packageId}`, packageId)
      }
    }
    const end = performance.now()
    console.error(`Solved in ${Math.round(end - start)}ms`)

    const counts = {}
    const reachabilities = Object.entries(this.packageReachabilities)
    for (const [packageId, importers] of reachabilities) {
      if (importers.size === 1) {
        const importer = Array.from(importers)[0]
        counts[importer] ??= 0
        counts[importer]++
        // counts[importer].push(packageId)
      }
    }

    console.log(
      Object.entries(counts)
        .map(([importer, count]) => `${count}\t${importer}`)
        .join("\n"),
    )
  }

  traverse(importerId: string, packageId: string) {
    if (packageId.includes("link:")) {
      return
    }

    const pkg = this.lockfile.packages[packageId]

    if (!pkg) {
      console.error(`Package not found: ${packageId}`)
      return
    }

    if (!this.packageReachabilities[packageId]) {
      this.packageReachabilities[packageId] = new Set()
    }

    this.packageReachabilities[packageId].add(importerId)

    const combinedDeps = [
      ...Object.entries(pkg.dependencies ?? {}),
      ...Object.entries(pkg.devDependencies ?? {}),
      ...Object.entries(pkg.optionalDependencies ?? {}),
    ]

    for (const [depName, depVersion] of combinedDeps) {
      const depId = `/${depName}@${depVersion}`
      if (this.packageReachabilities[depId]?.has(importerId)) {
        continue
      }

      this.traverse(importerId, depId)
    }
  }
}

const graph = new Graph(parse(fs.readFileSync("pnpm-lock.yaml", "utf8")))
graph.solve()
