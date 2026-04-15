import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { supportMaterialSchema } from '../../schemas/supportMaterialSchema';
import { useCreationStore } from '../../stores/useCreationStore';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { FieldWrapper } from '../FieldWrapper/FieldWrapper';
import { NumberInput } from '../NumberInput/NumberInput';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import { Select } from '../Select/Select';
import { Textarea } from '../Textarea/Textarea';
import { TextInput } from '../TextInput/TextInput';
import styles from './SupportMaterialForm.module.css';
import type { SupportMaterial } from '../../schemas/supportMaterialSchema';
import type { FieldError } from 'react-hook-form';

interface SupportMaterialFormProps {
  initialData?: SupportMaterial;
  onSuccess?: () => void;
}

interface AllFormErrors {
  type?: FieldError;
  name?: FieldError;
  qty?: FieldError;
  multiplier?: FieldError;
  groupQty?: FieldError;
  notes?: FieldError;
  url?: FieldError;
  sides?: FieldError;
  size?: FieldError;
  color?: FieldError;
  staple?: FieldError;
  tool?: FieldError;
  otherToolName?: FieldError;
  editUrl?: FieldError;
  resultsUrl?: FieldError;
}

const getDefaultValues = (): Partial<SupportMaterial> => ({
  id: uuidv4(),
  name: '',
});

export const SupportMaterialForm = ({ initialData, onSuccess }: SupportMaterialFormProps) => {
  const addMaterial = useCreationStore(state => state.addMaterial);
  const updateMaterial = useCreationStore(state => state.updateMaterial);

  const isEditing = !!initialData;
  const initialDataId = initialData?.id;

  const { register, handleSubmit, control, reset, formState } = useForm<SupportMaterial>({
    resolver: zodResolver(supportMaterialSchema),
    shouldUnregister: true,
    defaultValues: initialData ?? getDefaultValues(),
  });

  const errors = formState.errors as AllFormErrors;
  const isSubmitting = formState.isSubmitting;

  useEffect(() => {
    reset(initialData ?? getDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDataId, reset]);

  const watchType = useWatch({ control, name: 'type' });
  const watchMultiplier = useWatch({ control, name: 'multiplier' });
  const watchTool = useWatch({ control, name: 'tool' });

  const onSubmit = (data: SupportMaterial) => {
    if (isEditing) {
      updateMaterial(initialData.id, data);
    } else {
      addMaterial({ ...data, id: uuidv4() });
    }

    onSuccess?.();
    if (!isEditing) reset(getDefaultValues());
  };

  return (
    <form
      onSubmit={e => {
        void handleSubmit(onSubmit)(e);
      }}
      className={styles.container}
    >
      <input type="hidden" {...register('id')} />

      <FieldWrapper id="type" label="Tipo" error={errors.type?.message}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup
              id="type"
              options={[
                { label: 'Papelaria', value: 'Papelaria' },
                { label: 'Impressão', value: 'Impressão' },
                { label: 'Digital', value: 'Digital' },
              ]}
              orientation="horizontal"
              disabled={isEditing}
              hasError={!!errors.type}
              {...field}
            />
          )}
        />
      </FieldWrapper>

      <FieldWrapper id="name" label="Nome" error={errors.name?.message}>
        <TextInput
          id="name"
          placeholder="Ex: cartolina, atividade em grupo..."
          hasError={!!errors.name}
          {...register('name')}
        />
      </FieldWrapper>

      {(watchType === 'Papelaria' || watchType === 'Impressão') && (
        <div className={styles.flexRow}>
          <FieldWrapper
            id="qty"
            label="Quantidade"
            error={errors.qty?.message}
            className={styles.autoCol}
          >
            <NumberInput
              id="qty"
              hasError={!!errors.qty}
              min={1}
              {...register('qty', { valueAsNumber: true })}
            />
          </FieldWrapper>

          <FieldWrapper
            id="multiplier"
            label="Multiplicador"
            error={errors.multiplier?.message}
            className={styles.flexGrowCol}
          >
            <Select
              id="multiplier"
              options={[
                { label: 'Cursista', value: 'Cursista' },
                { label: 'Formador', value: 'Formador' },
                { label: 'Sala', value: 'Sala' },
                { label: 'Turma', value: 'Turma' },
                { label: 'Grupo', value: 'Grupo' },
              ]}
              placeholder="Selecione..."
              hasError={!!errors.multiplier}
              {...register('multiplier')}
            />
          </FieldWrapper>

          {watchMultiplier === 'Grupo' && (
            <FieldWrapper
              id="groupQty"
              label="Quantos grupos?"
              error={errors.groupQty?.message}
              className={styles.autoCol}
            >
              <NumberInput
                id="groupQty"
                hasError={!!errors.groupQty}
                min={2}
                {...register('groupQty', { valueAsNumber: true })}
              />
            </FieldWrapper>
          )}
        </div>
      )}

      {watchType === 'Impressão' && (
        <>
          <div className={styles.grid3Col}>
            <FieldWrapper id="sides" label="Lados" error={errors.sides?.message}>
              <Select
                id="sides"
                options={[
                  { label: 'Frente', value: 'Frente' },
                  { label: 'Frente e verso', value: 'Frente e verso' },
                ]}
                placeholder="Selecione..."
                hasError={!!errors.sides}
                {...register('sides')}
              />
            </FieldWrapper>

            <FieldWrapper id="size" label="Tamanho" error={errors.size?.message}>
              <Select
                id="size"
                options={[
                  { label: 'A1', value: 'A1' },
                  { label: 'A2', value: 'A2' },
                  { label: 'A3', value: 'A3' },
                  { label: 'A4', value: 'A4' },
                  { label: 'A5', value: 'A5' },
                ]}
                placeholder="Selecione..."
                hasError={!!errors.size}
                {...register('size')}
              />
            </FieldWrapper>

            <FieldWrapper id="color" label="Cor" error={errors.color?.message}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    id="color"
                    options={[
                      { label: 'Colorido', value: 'Colorido' },
                      { label: 'Preto e branco', value: 'Preto e branco' },
                    ]}
                    hasError={!!errors.color}
                    {...field}
                  />
                )}
              />
            </FieldWrapper>
          </div>

          <Checkbox id="staple" label="Grampear?" {...register('staple')} />

          <FieldWrapper id="url" label="Link para o arquivo" error={errors.url?.message}>
            <TextInput
              id="url"
              type="url"
              placeholder="https://..."
              hasError={!!errors.url}
              {...register('url')}
            />
          </FieldWrapper>
        </>
      )}

      {(watchType === 'Papelaria' || watchType === 'Impressão') && (
        <FieldWrapper id="notes" label="Observações" error={errors.notes?.message}>
          <Textarea
            id="notes"
            placeholder="Ex: cores das cartolinas, gramatura do papel, ..."
            hasError={!!errors.notes}
            {...register('notes')}
          />
        </FieldWrapper>
      )}

      {watchType === 'Digital' && (
        <>
          <FieldWrapper id="tool" label="Ferramenta" error={errors.tool?.message}>
            <Select
              id="tool"
              options={[
                { label: 'Padlet', value: 'Padlet' },
                { label: 'Mentimeter', value: 'Mentimeter' },
                { label: 'Quizizz', value: 'Quizizz' },
                { label: 'Kahoot', value: 'Kahoot' },
                { label: 'Outra', value: 'Outro' },
              ]}
              placeholder="Selecione..."
              hasError={!!errors.tool}
              {...register('tool')}
            />
          </FieldWrapper>

          <FieldWrapper
            id="url"
            label={
              watchTool === 'Outro' || watchTool === 'Padlet' ? 'Link' : 'Link de participação'
            }
            error={errors.url?.message}
          >
            <TextInput
              id="url"
              type="url"
              placeholder="https://..."
              hasError={!!errors.url}
              {...register('url')}
            />
          </FieldWrapper>

          {watchTool === 'Outro' && (
            <FieldWrapper id="otherToolName" label="Qual?" error={errors.otherToolName?.message}>
              <TextInput
                id="otherToolName"
                placeholder="Indique o nome da ferramenta (site, Genially, etc.)"
                hasError={!!errors.otherToolName}
                {...register('otherToolName')}
              />
            </FieldWrapper>
          )}

          {(watchTool === 'Mentimeter' || watchTool === 'Quizizz' || watchTool === 'Kahoot') && (
            <FieldWrapper id="editUrl" label="Link de edição" error={errors.editUrl?.message}>
              <TextInput
                id="editUrl"
                type="url"
                placeholder="https://"
                hasError={!!errors.editUrl}
                {...register('editUrl')}
              />
            </FieldWrapper>
          )}

          {watchTool === 'Mentimeter' && (
            <FieldWrapper
              id="resultsUrl"
              label="Link de Resultados"
              error={errors.resultsUrl?.message}
            >
              <TextInput
                id="resultsUrl"
                type="url"
                placeholder="https://"
                hasError={!!errors.resultsUrl}
                {...register('resultsUrl')}
              />
            </FieldWrapper>
          )}
        </>
      )}

      <Button type="submit" isLoading={isSubmitting}>
        {isEditing ? 'Salvar alterações' : 'Adicionar'}
      </Button>
    </form>
  );
};
