export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`

    if (binding.modifiers.right) {
      iconClass += ' float-right'
    }

    if (binding.modifiers.green) {
      iconClass += ' text-green-400'
    }

    el.innerHTML += `<i class="${iconClass}"></i>`
  }
}
