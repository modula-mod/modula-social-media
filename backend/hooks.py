"""Lifecycle hooks exposed by the Social module package."""

from .install import install
from .uninstall import uninstall

HOOKS = {
    "install": install,
    "uninstall": uninstall,
}
