"""
Insta485 python package configuration.

Andrew DeOrio <awdeorio@umich.edu>
"""

from setuptools import setup

setup(
    name='client',
    version='0.1.0',
    packages=['client'],
    include_package_data=True,
    install_requires=[
        'arrow==0.15.5',
        'bs4==0.0.1',
        'Flask==1.1.1',
        'html5validator==0.3.3',
        'nodeenv==1.3.5',
        'pycodestyle==2.5.0',
        'pydocstyle==5.0.2',
        'pylint==2.4.4',
        'pytest==5.3.5',
        'requests==2.22.0',
        'selenium==3.141.0',
        'google-cloud==0.34.0',
        'google-cloud-storage==1.27.0',
        'PyMySQL==0.9.3',
        ''
    ],
)
