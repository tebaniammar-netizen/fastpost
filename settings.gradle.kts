pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "FastFoodPosSystem"

include(":app-pos")
project(":app-pos").projectDir = file("android/app-pos")

include(":app-kds")
project(":app-kds").projectDir = file("android/app-kds")

include(":core-model")
project(":core-model").projectDir = file("android/core-model")

include(":core-database")
project(":core-database").projectDir = file("android/core-database")

include(":core-hardware")
project(":core-hardware").projectDir = file("android/core-hardware")

include(":core-sync")
project(":core-sync").projectDir = file("android/core-sync")
