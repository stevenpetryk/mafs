"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import { get } from "lodash"

import * as Mafs from "mafs"

export interface Docgen {
  filePath: string
  displayName: string
  props: Record<string, DocgenProp>
  description?: string
}

export interface DocgenProp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue: any
  description: string | null | undefined
  name: string
  required: boolean
  type: DocgenPropType
}

export type DocgenPropType =
  | { name: "enum" | "boolean"; raw: string; value: Array<{ value: string }> }
  | { name: string }

interface PropTableProps {
  of: string
}

export function PropTable({ of: componentAccessor }: PropTableProps) {
  // Turn "Coordinates.Cartesian" into the actual component Mafs.Coordinates.Cartesian
  const component = get(Mafs, componentAccessor)

  const docgenInfo = (component as { __docgenInfo: Docgen })?.__docgenInfo

  if (process.env.NODE_ENV === "development" && docgenInfo == null) {
    return (
      <p className="text-sm">
        Props are not loaded by default in development to keep hot reloading fast. Set{" "}
        <code>DOCGEN=1</code> to compile with type data.
      </p>
    )
  }

  if (docgenInfo == null || docgenInfo.props == null) {
    throw new Error("Non-docgen object passed to PropTable")
  }

  const displayName =
    // eslint-disable-next-line
    (component as any)?.displayName ?? docgenInfo.displayName

  const props = docgenInfo.props

  return (
    <div>
      <header className="flex gap-4 items-baseline py-4">
        <h2 className="text-base">Props</h2>

        <code className="font-medium mr-1 text-sm text-purple-600 dark:text-purple-300">
          <span className="opacity-50">{"<"}</span>
          {typeof displayName === "string" ? displayName : docgenInfo.displayName}
          <span className="opacity-50">{props.children ? ">...</" : " ... />"}</span>
          {props.children && (
            <>
              {typeof displayName === "string" ? displayName : docgenInfo.displayName}
              <span className="opacity-50">{">"}</span>
            </>
          )}
        </code>
      </header>

      <div className="overflow-x-auto text-sm">
        <table className="w-full relative">
          <thead className="text-left border-t border-b border-gray-300 dark:dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="font-normal py-1 pr-4">Name</th>
              <th className="font-normal py-1 pr-4">Description</th>
              <th className="font-normal py-1 pr-4">Default</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(props).map((prop, index) => (
              <tr
                key={index}
                className="relative border-b border-gray-300 dark:border-slate-800 border-opacity-50"
              >
                <td className="py-2 pr-4 align-baseline">
                  <PropName prop={prop} />
                </td>
                <td className="py-2 pr-4 w-max min-w-[35ch] align-baseline">
                  <PropType prop={prop} />
                </td>
                <td className="py-2 align-baseline text-gray-600 dark:text-slate-400 w-max max-w-lg">
                  <DefaultPropValue prop={prop} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PropName({ prop }: { prop: DocgenProp }) {
  const formattedName = <code>{prop.name}</code>
  return <span className="font-semibold p-1 rounded-md">{formattedName}</span>
}

function DefaultPropValue({ prop }: { prop: DocgenProp }) {
  let value = prop.defaultValue?.value
  if (value == null) return <>—</>

  if (typeof value === "boolean") {
    value = value === true ? "true" : "false"
  }

  return value ? <code className="w-max max-w-lg whitespace-nowrap">{value}</code> : <>—</>
}

function FunctionPropType({ type }: { type: string }) {
  return <code>{type}</code>
}

function PropType({ prop }: { prop: DocgenProp }) {
  const { type } = prop

  let typeNode: React.ReactNode
  if (isFunctionType(type.name) != null) {
    typeNode = <FunctionPropType type={type.name} />
  } else if (type.name.startsWith("{")) {
    typeNode = <code>{type.name}</code>
  } else if ("value" in type) {
    typeNode = <EnumerablePropType values={type.value} raw={type.raw} />
  } else {
    typeNode = <code>{type.name}</code>
  }

  return (
    <div className="flex flex-col gap-1">
      {prop.description && (
        <p className="text-gray-800 dark:text-slate-200 markdown">
          <ReactMarkdown>{prop.description}</ReactMarkdown>
        </p>
      )}
      <div className="text-gray-600 dark:text-slate-400">{typeNode}</div>
    </div>
  )
}

function isFunctionType(value: string) {
  return value.match(/\(.*\) => \w/)
}

function EnumerablePropType({
  values,
  raw,
  limit = 5,
}: {
  limit?: number
  raw: string
  values: Array<{ value: string }>
}) {
  const [showAll, setShowAll] = React.useState(false)

  if (raw === "boolean" || !raw.includes("|")) {
    return <code>{raw}</code>
  }

  function formatValues(values: Array<{ value: string }>) {
    return values.map(({ value }) => (
      <li key={value}>
        {isFunctionType(value) != null ? <FunctionPropType type={value} /> : <code>{value}</code>}
      </li>
    ))
  }

  let listContents
  if (values.length > limit) {
    listContents = (
      <>
        {formatValues(values.slice(0, limit))}
        {showAll && formatValues(values.slice(limit))}
        <li>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setShowAll(!showAll)
            }}
          >
            Show {showAll ? "less" : `${values.length - limit} more`}...
          </button>
        </li>
      </>
    )
  } else {
    listContents = formatValues(values)
  }

  return <ul>{listContents}</ul>
}
