"use client"
import * as React from "react"

import { InfoCircledIcon } from "@radix-ui/react-icons"
import * as Tooltip from "@radix-ui/react-tooltip"

export interface Docgen {
  filePath: string
  displayName: string
  props: Record<string, DocgenProp>
  description?: string
}

export interface DocgenProp {
  defaultValue: any
  description: string | null | undefined
  name: string
  required: boolean
  type: DocgenPropType
}

export type DocgenPropType =
  | { name: "enum" | "boolean"; raw: string; value: Array<{ value: string }> }
  | { name: string }

const styles: any = {}

export function PropTable({ info }: { info: Docgen }) {
  if (process.env.NODE_ENV === "development" && info == null)
    return (
      <div className="text-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Props are not loaded by default in development to keep hot reloading fast. Set{" "}
          <code>DOCGEN=1</code> to compile with type data.
        </p>
      </div>
    )
  const props = info.props

  return (
    <div className="text-sm">
      <table className="w-full">
        <thead className="sr-only text-left border-b dark:border-slate-700 dark:text-slate-400">
          <tr>
            <th className="font-normal py-2 pr-4">Name</th>
            <th className="font-normal py-2 pr-4">Type</th>
            <th className="font-normal py-2 pr-4">Default</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(props).map((prop, index) => (
            <tr key={index}>
              <td className="py-2 pr-4 border-b dark:border-slate-800">
                <PropName prop={prop} />
              </td>
              <td className="py-2 pr-4 border-b dark:border-slate-800">
                <PropType prop={prop} />
              </td>
              <td className="py-2 border-b dark:border-slate-800 dark:text-slate-400">
                <DefaultPropValue prop={prop} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PropName({ prop }: { prop: DocgenProp }) {
  const formattedName = <code>{prop.name}</code>
  return <span className="bg-blue-800 px-1 rounded-md">{formattedName}</span>
}

function DefaultPropValue({ prop }: { prop: DocgenProp }) {
  let value = prop.defaultValue?.value
  if (value == null) return <>—</>

  if (typeof value === "boolean") {
    value = value === true ? "true" : "false"
  }

  return value ? <code>{value ?? "—"}</code> : <>—</>
}

function FunctionPropType({ type }: { type: string }) {
  return (
    // <TooltipContainer
    //   allowOverflow
    //   aria-label={type}
    //   className={styles.functionCellTooltipWrapper}
    //   tooltipContentClassName={styles.functionCellTooltipContainer}
    //   tooltipClassName={styles.functionCellTooltipContainer}
    //   text={<code style={{ whiteSpace: "nowrap" }}>{type}</code>}
    // >
    <code className={styles.functionCellTooltipContent}>{type}</code>
    // </TooltipContainer>
  )
}

function PropType({ prop }: { prop: DocgenProp }) {
  const { type } = prop

  let typeNode: React.ReactNode
  if (isFunctionType(type.name) != null) {
    typeNode = <FunctionPropType type={type.name} />
  } else if (type.name.startsWith("{")) {
    typeNode = <code>object</code>
  } else if ("value" in type) {
    typeNode = <EnumerablePropType values={type.value} raw={type.raw} />
  } else {
    typeNode = <code>{type.name}</code>
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="text-slate-400">{typeNode}</div>
      {prop.description && <p className="text-slate-200">{prop.description}</p>}
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
      <li key={value} className={styles.enumerablePropTypeItem}>
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

  return <ul className={styles.enumerablePropTypeWrapper}>{listContents}</ul>
}
