import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Tooltip } from './Tooltip';
import styles from './Tooltip.module.css';

describe('Tooltip', () => {
  it('should not render the tooltip content initially', () => {
    render(
      <Tooltip content="Texto do tooltip">
        <button>Gatilho</button>
      </Tooltip>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should show the tooltip on hover, apply aria-describedby, and hide on mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Texto do tooltip">
        <button>Gatilho</button>
      </Tooltip>,
    );

    const triggerElement = screen.getByText('Gatilho');

    expect(triggerElement).not.toHaveAttribute('aria-describedby');

    await user.hover(triggerElement);
    const tooltipElement = screen.getByRole('tooltip', { name: 'Texto do tooltip' });

    expect(tooltipElement).toBeInTheDocument();
    expect(triggerElement).toHaveAttribute('aria-describedby', tooltipElement.id);

    await user.unhover(triggerElement);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('should show the tooltip on focus and hide on blur', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Acessível por teclado">
        <button>Gatilho Focus</button>
      </Tooltip>,
    );

    const triggerElement = screen.getByText('Gatilho Focus');

    await user.tab();
    expect(triggerElement).toHaveFocus();
    expect(screen.getByRole('tooltip', { name: 'Acessível por teclado' })).toBeInTheDocument();

    await user.tab();
    expect(triggerElement).not.toHaveFocus();
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('should hide the tooltip when the Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Vai sumir com ESC">
        <button>Gatilho ESC</button>
      </Tooltip>,
    );

    const triggerElement = screen.getByText('Gatilho ESC');

    await user.tab();
    expect(triggerElement).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('should apply the correct position class based on the position prop', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Tooltip content="Posição" position="top">
        <button>Top Btn</button>
      </Tooltip>,
    );

    await user.hover(screen.getByText('Top Btn'));
    expect(screen.getByRole('tooltip')).toHaveClass(styles.top);

    rerender(
      <Tooltip content="Posição" position="bottom">
        <button>Bottom Btn</button>
      </Tooltip>,
    );
    await user.hover(screen.getByText('Bottom Btn'));
    expect(screen.getByRole('tooltip')).toHaveClass(styles.bottom);

    rerender(
      <Tooltip content="Posição" position="left">
        <button>Left Btn</button>
      </Tooltip>,
    );
    await user.hover(screen.getByText('Left Btn'));
    expect(screen.getByRole('tooltip')).toHaveClass(styles.left);

    rerender(
      <Tooltip content="Posição" position="right">
        <button>Right Btn</button>
      </Tooltip>,
    );
    await user.hover(screen.getByText('Right Btn'));
    expect(screen.getByRole('tooltip')).toHaveClass(styles.right);
  });

  it('should preserve and call existing event handlers on the child element', async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <Tooltip content="Tooltip Eventos">
        <button
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        >
          Gatilho com Eventos
        </button>
      </Tooltip>,
    );

    const trigger = screen.getByText('Gatilho com Eventos');

    await user.hover(trigger);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    await user.unhover(trigger);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(trigger).toHaveFocus();
    expect(onFocus).toHaveBeenCalledTimes(1);

    await user.keyboard('{Escape}');
    expect(onKeyDown).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(trigger).not.toHaveFocus();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should warn and return children unchanged if children is not a valid React element', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <Tooltip content="Tooltip Inválido">{'Texto solto' as unknown as ReactElement}</Tooltip>,
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'O children do Tooltip deve ser um elemento React válido.',
    );
    expect(screen.getByText('Texto solto')).toBeInTheDocument();

    consoleWarnSpy.mockRestore();
  });
});
