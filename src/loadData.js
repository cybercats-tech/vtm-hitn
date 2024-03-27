import PublicGoogleSheetsParser from 'public-google-sheets-parser'

// eslint-disable-next-line no-undef
const spreadsheetId = '1RHrZR3mtXQ783ROoRYKsCyIgYsQqFNEZ2PfyAd-xgec'

export const load = () => {
// 1. You can pass spreadsheetId when instantiating the parser:
  const parser = new PublicGoogleSheetsParser()
  
  return Promise.all([
    // parser.parse(spreadsheetId, 'CONFIG').then(data => ({ config: arrToObject(data) })),
    parser.parse(spreadsheetId, 'NPCs').then(data => ({ npcs: data })),
    parser.parse(spreadsheetId, 'PCs').then(data => ({ pcs: data })),
  ]).then(result => {
    const data = result.reduce(
      (acc, itemAsArr) => {
        try {
          const [key, value] = Object.entries(itemAsArr)[0]  
          
          return { ...acc, [key]: value }
        } catch (error) {
          return acc
        }
       },
      {}
    )

    console.log(data)

    return data
  })
}

// const arrToObject = (dataArr) => dataArr.reduce(
//   (acc, row) => {
//     Object.entries(row).forEach(([key, value]) => {
//       if(acc[key] && Array.isArray(acc[key]) ) {
//         acc[key].push(value)
//       } else if(acc[key]) {
//         acc[key] = [acc[key], value]
//       } else acc[key] = value
//     })

//     return acc
//   },
//   {}
// )