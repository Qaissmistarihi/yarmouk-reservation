const fs = require('fs')
const path = require('path')
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} = require('docx')

function isTableLine(line) {
  const t = line.trim()
  return t.startsWith('|') && t.endsWith('|') && t.includes('|')
}

function isTableSeparator(line) {
  const t = line.trim()
  return /^\|\s*[-:]+\s*(\|\s*[-:]+\s*)+\|$/.test(t)
}

function parseTableBlock(lines, startIdx) {
  const rows = []
  let i = startIdx
  while (i < lines.length && isTableLine(lines[i])) {
    if (!isTableSeparator(lines[i])) {
      const cells = lines[i]
        .trim()
        .slice(1, -1)
        .split('|')
        .map(s => s.trim())
      rows.push(cells)
    }
    i++
  }
  return { rows, nextIdx: i }
}

function mdToDocx(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')

  const children = []
  let inCode = false
  let codeLines = []

  const flushCode = () => {
    if (!codeLines.length) return
    const text = codeLines.join('\n')
    children.push(
      new Paragraph({
        children: [new TextRun({ text, font: 'Consolas' })],
      })
    )
    codeLines = []
  }

  let i = 0
  while (i < lines.length) {
    const raw = lines[i]
    const line = raw

    if (line.trim().startsWith('```')) {
      if (inCode) {
        inCode = false
        flushCode()
      } else {
        inCode = true
      }
      i++
      continue
    }

    if (inCode) {
      codeLines.push(line)
      i++
      continue
    }

    if (isTableLine(line)) {
      const { rows, nextIdx } = parseTableBlock(lines, i)
      i = nextIdx

      if (rows.length) {
        const tableRows = rows.map(r => (
          new TableRow({
            children: r.map(c => new TableCell({
              children: [new Paragraph({ children: [new TextRun(c)] })],
            })),
          })
        ))

        children.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          })
        )
      }
      continue
    }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      const level = h[1].length
      const text = h[2].trim()
      const heading = [
        HeadingLevel.HEADING_1,
        HeadingLevel.HEADING_2,
        HeadingLevel.HEADING_3,
        HeadingLevel.HEADING_4,
        HeadingLevel.HEADING_5,
        HeadingLevel.HEADING_6,
      ][level - 1]

      children.push(new Paragraph({ text, heading }))
      i++
      continue
    }

    // Bullets
    const bullet = line.match(/^\s*-\s+(.*)$/)
    if (bullet) {
      children.push(
        new Paragraph({
          text: bullet[1],
          bullet: { level: 0 },
        })
      )
      i++
      continue
    }

    // Numbered list
    const numbered = line.match(/^\s*(\d+)\)\s+(.*)$/)
    if (numbered) {
      children.push(
        new Paragraph({
          text: numbered[2],
          numbering: { reference: 'phase1-numbering', level: 0 },
        })
      )
      i++
      continue
    }

    // Empty line -> spacing
    if (!line.trim()) {
      children.push(new Paragraph({ text: '' }))
      i++
      continue
    }

    // Plain paragraph (keep inline backticks as-is)
    children.push(new Paragraph({
      children: [new TextRun(line)],
      alignment: AlignmentType.LEFT,
    }))

    i++
  }

  return new Document({
    numbering: {
      config: [
        {
          reference: 'phase1-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [{ children }],
  })
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..', '..')
  const inputPath = path.join(repoRoot, 'design', 'PHASE1.md')
  const outputPath = path.join(repoRoot, 'design', 'PHASE1.docx')

  const md = fs.readFileSync(inputPath, 'utf8')
  const doc = mdToDocx(md)

  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync(outputPath, buffer)

  console.log(`Created: ${outputPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
