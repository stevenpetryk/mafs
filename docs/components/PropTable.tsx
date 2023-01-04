"use client"
import * as React from "react"

// import { parseMarkdown } from "@app/uikit-next/src/helpers/markdown"
// import { DocgenProp, useDocgen } from "@app/uikit-next/src/hooks/useDocgen"
import { InfoCircledIcon } from "@radix-ui/react-icons"

// import styles from "./Props.module.css"

import * as Tooltip from "@radix-ui/react-tooltip"

const styles: any = {}

export function PropTable({ info }: { info: any }) {
  const props = info.props

  return (
    <div className="text-sm">
      <table className="w-full">
        <thead className="text-left border-b dark:border-slate-700 dark:text-slate-400">
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
              <td className="py-2 pr-4 border-b dark:border-slate-800 dark:text-slate-400">
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
  const { description } = prop

  const formattedName = <code className={styles.nameCell}>{prop.name}</code>

  const asteriskSize = 14
  // const requiredAsterisk = prop.required ? (
  //   <AsteriskIcon
  //     aria-label={`${prop.name} required`}
  //     color="var(--status-danger)"
  //     width={asteriskSize}
  //     height={asteriskSize}
  //   />
  // ) : null;
  const requiredAsterisk = null

  return description == null || description === "" ? (
    <span className="bg-blue-800 px-1 rounded-md">{formattedName}</span>
  ) : (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className="flex gap-2 items-center">
          <span className="bg-blue-800 px-1 rounded-md">{formattedName}</span>
          <span className="opacity-50">
            <InfoCircledIcon />
          </span>
          {requiredAsterisk}
        </button>
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Content>
          {description}
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

function DefaultPropValue({ prop }: { prop: DocgenProp }) {
  let value = prop.defaultValue?.value
  if (value == null) return "—"

  if (typeof value === "boolean") {
    value = value === true ? "true" : "false"
  }

  return value ? <code>{value ?? "—"}</code> : "—"
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

  if (isFunctionType(type.name) != null) {
    return <FunctionPropType type={type.name} />
  } else if (type.name.startsWith("{")) {
    return <code>object</code>
  } else if ("value" in type) {
    return <EnumerablePropType values={type.value} raw={type.raw} />
  } else {
    return <code>{type.name}</code>
  }
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
