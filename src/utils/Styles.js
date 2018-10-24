export const layout = {
  margin(...arg) {
    let margin = {}
    switch (arg.length) {
      case 1:
        margin = {
          marginTop: arg[0],
          marginRight: arg[0],
          marginBottom: arg[0],
          marginLeft: arg[0],
        }
        break;

      case 2:
        margin = {
          marginVertical: arg[0],
          marginHorizontal: arg[1],
        }
        break;

      case 3:
        margin = {
          marginTop: arg[0],
          marginHorizontal: arg[1],
          marginBottom: arg[2],
        }
        break;

      case 4:
        margin = {
          marginTop: arg[0],
          marginRight: arg[1],
          marginBottom: arg[2],
          marginLeft: arg[3],
        }
        break;

      default:
        break;
    }
    return margin
  },
  padding(...arg) {
    let padding = {}
    switch (arg.length) {
      case 1:
        padding = {
          paddingTop: arg[0],
          paddingRight: arg[0],
          paddingBottom: arg[0],
          paddingLeft: arg[0],
        }
        break;

      case 2:
        padding = {
          paddingVertical: arg[0],
          paddingHorizontal: arg[1],
        }
        break;

      case 3:
        padding = {
          paddingTop: arg[0],
          paddingHorizontal: arg[1],
          paddingBottom: arg[2],
        }
        break;

      case 4:
        padding = {
          paddingTop: arg[0],
          paddingRight: arg[1],
          paddingBottom: arg[2],
          paddingLeft: arg[3],
        }
        break;

      default:
        break;
    }
    return padding
  }
}