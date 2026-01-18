module.exports = {
  hooks: {
    readPackage(packageManifest) {
      if (
        packageManifest?.name === 'next' &&
        packageManifest.optionalDependencies &&
        packageManifest.optionalDependencies.sharp
      ) {
        const { sharp, ...rest } = packageManifest.optionalDependencies
        if (Object.keys(rest).length === 0) {
          delete packageManifest.optionalDependencies
        } else {
          packageManifest.optionalDependencies = rest
        }
      }

      return packageManifest
    },
  },
}

