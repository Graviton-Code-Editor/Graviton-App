import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
    tones: {
        dark1: '#191919',
        dark2: '#222222',
    },
    elements: {
        tabsContainer: {
            background: '#191919'
        },
        view: {
            background: '#222222'
        },
        explorer: {
            item: {
                background: 'transparent',
                text: {
                    color: 'white'
                },
                hover: {
                    background: 'rgba(150,150,150,0.3)'
                },
                selected: {
                    background: 'rgba(150,150,150,0.3)'
                }
            }
        },
        sidebar: {
            button: {
                background: 'transparent',
                hover: {
                    background: 'rgb(40,40,40)'
                },
                selected: {
                    background: 'rgb(50,50,50)'
                }
            }
        }
    }
};

function Theme({ children }: PropsWithChildren<any>) {
    return (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    )
}

export default Theme;
